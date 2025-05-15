
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { HostelLayout } from "./components/HostelLayout";
import Dashboard from "./pages/Index";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Complaints from "./pages/Complaints";
import Emergency from "./pages/Emergency";
import Outings from "./pages/Outings";
import Announcements from "./pages/Announcements";
import Laundry from "./pages/Laundry";
import Profile from "./pages/Profile";
import Allocations from "./pages/Allocations";
import Students from "./pages/Students";
import Approvals from "./pages/Approvals";
import NotFound from "./pages/NotFound";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          
          <Route element={<HostelLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/outings" element={<Outings />} />
            <Route path="/laundry" element={<Laundry />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/allocations" element={<Allocations />} />
            <Route path="/students" element={<Students />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
