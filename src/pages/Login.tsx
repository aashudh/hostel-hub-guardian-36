
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
      navigate("/");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-hostel-blue to-hostel-dark p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Hostel Management System</h1>
          <p className="text-white/80 mt-2">Sign in to access your account</p>
        </div>

        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
            <TabsTrigger value="credentials">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Access</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials">
            <Card>
              <CardHeader>
                <CardTitle>Account Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-sm">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full bg-hostel-blue hover:bg-hostel-dark" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Demo Accounts</CardTitle>
                <CardDescription>
                  Use these credentials to explore the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Student Account</h3>
                  <p className="text-sm">Email: student@example.com</p>
                  <p className="text-sm">Password: password</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full"
                    onClick={() => {
                      setEmail("student@example.com");
                      setPassword("password");
                      setTimeout(() => {
                        login("student@example.com", "password");
                        navigate("/");
                      }, 500);
                    }}
                  >
                    Login as Student
                  </Button>
                </div>
                
                <div className="border rounded-lg p-4 bg-muted/50">
                  <h3 className="font-medium mb-2">Warden Account</h3>
                  <p className="text-sm">Email: warden@example.com</p>
                  <p className="text-sm">Password: password</p>
                  <Button 
                    variant="outline" 
                    className="mt-2 w-full"
                    onClick={() => {
                      setEmail("warden@example.com");
                      setPassword("password");
                      setTimeout(() => {
                        login("warden@example.com", "password");
                        navigate("/");
                      }, 500);
                    }}
                  >
                    Login as Warden
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  These are demo accounts for testing purposes only.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
