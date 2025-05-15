
import { useState, FormEvent } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export default function Registration() {
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Missing information", {
        description: "Please fill in all fields."
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please make sure your passwords match."
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Check if user was created but email confirmation failed
      if (data?.user && !data.user.confirmed_at) {
        toast.success("Account created", {
          description: "Your account has been created. You can now login."
        });
        navigate("/login");
      } else {
        toast.success("Account created", {
          description: "Your account has been created, but there was an issue sending the confirmation email. You can still login."
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: error.message || "Failed to register"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Create an Account</h1>
          <p className="text-slate-300 mt-2">Join our Hostel Management System</p>
        </div>

        <Card className="border-slate-200 shadow-lg bg-white/10 backdrop-blur-sm">
          <CardHeader className="space-y-1 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg border-b border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-slate-500 rounded-full p-3">
                <UserPlus size={24} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-xl">Register</CardTitle>
            <CardDescription className="text-slate-300">Enter your details to create an account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6 bg-white/5 text-white">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-500 focus:border-blue-400 focus:ring-blue-400 text-white"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-500 focus:border-blue-400 focus:ring-blue-400 text-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-500 focus:border-blue-400 focus:ring-blue-400 text-white"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-b-lg border-t border-slate-600 pt-4">
              <Button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Creating Account...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign up
                  </>
                )}
              </Button>
              <p className="text-sm text-slate-300 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-300 hover:text-blue-100 hover:underline">
                  Log in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
