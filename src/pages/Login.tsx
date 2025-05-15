
import { useState, FormEvent } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, LogIn, Mail } from "lucide-react";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Missing information", {
        description: "Please enter your email and password"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful", {
        description: "Welcome back!"
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Failed to login. Please check your credentials."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const useDemoAccount = async () => {
    setEmail("demo@example.com");
    setPassword("password123");
    
    // Auto-submit the form with demo credentials
    setIsLoading(true);
    try {
      await login("demo@example.com", "password123");
      toast.success("Demo login successful", {
        description: "Welcome to the demo account!"
      });
    } catch (error: any) {
      console.error("Demo login error:", error);
      toast.error("Demo login failed", {
        description: error.message || "Failed to login with demo account."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">Hostel Management System</h1>
          <p className="text-slate-300 mt-2">Login to access your account</p>
        </div>
        
        <Card className="border-slate-200 shadow-lg bg-white/10 backdrop-blur-sm">
          <CardHeader className="space-y-1 bg-gradient-to-r from-slate-700 to-slate-800 rounded-t-lg border-b border-slate-600">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-slate-500 rounded-full p-3">
                <LogIn size={24} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-white text-xl">Login</CardTitle>
            <CardDescription className="text-slate-300">Enter your credentials to continue</CardDescription>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Link 
                    to="#" 
                    className="text-sm text-blue-300 hover:text-blue-100 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
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
            </CardContent>
            <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-slate-700 to-slate-800 rounded-b-lg border-t border-slate-600 pt-4">
              <Button 
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="mr-2">Logging in...</span>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log in
                  </>
                )}
              </Button>
              <button 
                type="button"
                onClick={useDemoAccount}
                className="w-full bg-slate-600 hover:bg-slate-500 text-white py-2 rounded-md flex items-center justify-center"
                disabled={isLoading}
              >
                <span>Use Demo Account</span>
              </button>
              <div className="mt-2 flex items-center justify-center gap-1">
                <p className="text-sm text-slate-300">Demo: </p>
                <p className="text-sm font-medium text-blue-300">demo@example.com / password123</p>
              </div>
              <p className="text-sm text-slate-300 text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-300 hover:text-blue-100 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
