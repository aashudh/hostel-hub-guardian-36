
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.log("Index page - Authentication state:", isAuthenticated);
    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate("/login");
    } else {
      console.log("User is authenticated, showing dashboard");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? <Dashboard /> : null;
};

export default Index;
