
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
      toast.error("Missing information", "Please enter your email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast.success("Login successful", "Welcome back!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Login failed", error.message || "Failed to login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-800">Hostel Management System</h1>
          <p className="text-slate-600 mt-2">Login to access your account</p>
        </div>
        
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="space-y-1 bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg border-b border-slate-200">
            <div className="flex items-center justify-center mb-2">
              <div className="bg-blue-600 rounded-full p-3">
                <LogIn size={24} className="text-white" />
              </div>
            </div>
            <CardTitle className="text-slate-800 text-xl">Login</CardTitle>
            <CardDescription className="text-slate-600">Enter your credentials to continue</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email</Label>
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
                    className="pl-10 bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">Password</Label>
                  <Link 
                    to="#" 
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
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
                    className="bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
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
            <CardFooter className="flex flex-col gap-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-b-lg border-t border-slate-200 pt-4">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
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
              <p className="text-sm text-slate-600 text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:text-blue-800 hover:underline">
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
