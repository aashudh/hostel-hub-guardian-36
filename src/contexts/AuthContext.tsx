import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "sonner";

type UserRole = 'student' | 'warden' | null;

type User = {
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
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isWarden: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: '1',
    name: 'John Doe',
    email: 'student@example.com',
    password: 'password',
    role: 'student' as UserRole,
    roomNumber: 'A-101',
    hostelBlock: 'Block A',
    profileImage: '/placeholder.svg',
    phoneNumber: '555-123-4567',
    emergencyContacts: ['Parent: 555-234-5678', 'Guardian: 555-345-6789', '']
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'warden@example.com',
    password: 'password',
    role: 'warden' as UserRole,
    hostelBlock: 'All Blocks',
    profileImage: '/placeholder.svg',
    phoneNumber: '555-987-6543',
    emergencyContacts: ['Admin Office: 555-111-2222', 'Security: 555-333-4444', '']
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string) => {
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Omit password from the user object
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      toast.success(`Welcome back, ${foundUser.name}!`);
    } else {
      toast.error("Invalid email or password");
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user,
      isWarden: user?.role === 'warden',
      isStudent: user?.role === 'student'
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
