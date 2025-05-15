
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Session } from '@supabase/supabase-js';

export type UserRole = 'student' | 'warden' | null;

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roomNumber?: string;
  hostelBlock?: string;
  profileImage?: string;
  phoneNumber?: string;
  emergencyContacts?: string[];
};

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isWarden: boolean;
  isStudent: boolean;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state
  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession ? "Session exists" : "No session");
        setSession(newSession);
        
        if (newSession?.user) {
          // We'll fetch user data in a non-blocking way
          fetchUserData(newSession.user.id);
        } else {
          setUser(null);
          setIsInitializing(false);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Checking for existing session:", currentSession ? "Found" : "None found");
      setSession(currentSession);
      
      if (currentSession?.user) {
        fetchUserData(currentSession.user.id);
      } else {
        setIsInitializing(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Check if user exists in either students or wardens table
      const studentRes = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      const wardenRes = await supabase
        .from('wardens')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (studentRes.data) {
        // Convert emergency_contacts to array if it's not already
        let emergencyContacts: string[] = [];
        if (studentRes.data.emergency_contacts) {
          if (Array.isArray(studentRes.data.emergency_contacts)) {
            // Map each item to string to ensure type compatibility
            emergencyContacts = studentRes.data.emergency_contacts.map(contact => 
              typeof contact === 'string' ? contact : String(contact)
            );
          } else if (typeof studentRes.data.emergency_contacts === 'string') {
            emergencyContacts = [studentRes.data.emergency_contacts];
          }
        }

        setUser({
          id: studentRes.data.id,
          name: studentRes.data.name,
          email: studentRes.data.email,
          role: 'student',
          roomNumber: studentRes.data.room_number,
          hostelBlock: studentRes.data.hostel_block,
          phoneNumber: studentRes.data.phone,
          emergencyContacts
        });
      } else if (wardenRes.data) {
        setUser({
          id: wardenRes.data.id,
          name: wardenRes.data.name,
          email: wardenRes.data.email,
          role: 'warden',
          hostelBlock: wardenRes.data.hostel_block,
          phoneNumber: wardenRes.data.phone,
          emergencyContacts: []
        });
      } else {
        console.log("User found in auth but not in students or wardens tables");
        setUser(null);
      }
      setIsInitializing(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setIsInitializing(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error.message);
        throw error;
      }
      
      console.log("Login successful:", data.user?.email);
      // Return void to match the interface
    } catch (error: any) {
      console.error("Login function error:", error.message);
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      // Register the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) {
        if (authError.message?.includes("smtp") || authError.message?.includes("email")) {
          console.warn("Email confirmation error, but registration succeeded:", authError.message);
          // Continue with user creation even if email confirmation failed
        } else {
          throw authError;
        }
      }
      
      if (!authData.user) {
        throw new Error("Registration failed - no user returned");
      }

      // Create the user profile in the appropriate table
      if (userData.role === 'student') {
        const { error: studentError } = await supabase.from('students').insert({
          user_id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phoneNumber,
          room_number: userData.roomNumber || 'Unassigned',
          hostel_block: userData.hostelBlock || 'Unassigned',
          emergency_contacts: userData.emergencyContact ? [userData.emergencyContact] : []
        });

        if (studentError) throw studentError;
      } else if (userData.role === 'warden') {
        const { error: wardenError } = await supabase.from('wardens').insert({
          user_id: authData.user.id,
          name: userData.name,
          email: userData.email,
          phone: userData.phoneNumber,
          hostel_block: userData.hostelBlock || 'All Blocks'
        });

        if (wardenError) throw wardenError;
      }

    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      toast.success("Logged out", {
        description: "You have been logged out"
      });
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error", {
        description: "Failed to log out"
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register,
      logout, 
      isAuthenticated: !!user,
      isWarden: user?.role === 'warden',
      isStudent: user?.role === 'student',
      session
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
