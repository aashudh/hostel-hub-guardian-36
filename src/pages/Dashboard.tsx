
import { useAuth } from "@/contexts/AuthContext";
import { 
  Home, 
  Users, 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  Bell,
  Calendar,
  User
} from "lucide-react";
import { QuickActionCard } from "@/components/dashboard/QuickActionCard";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

export default function Dashboard() {
  const { user, isWarden, isStudent } = useAuth();

  // Quick access cards for both roles
  const commonCards = [
    {
      title: "Profile",
      description: "View and update your personal information",
      icon: <User size={24} className="text-hostel-blue" />,
      path: "/profile",
      color: "bg-blue-50"
    },
    {
      title: "Complaints",
      description: "Submit and track your complaints",
      icon: <MessageSquare size={24} className="text-purple-500" />,
      path: "/complaints",
      color: "bg-purple-50"
    },
    {
      title: "Emergency",
      description: "Emergency contacts and alerts",
      icon: <Bell size={24} className="text-red-500" />,
      path: "/emergency",
      color: "bg-red-50"
    }
  ];

  // Student specific cards
  const studentCards = [
    {
      title: "Outings",
      description: "Register your outings and track time",
      icon: <Clock size={24} className="text-green-500" />,
      path: "/outings",
      color: "bg-green-50"
    },
    {
      title: "Laundry",
      description: "Track your laundry usage",
      icon: <Calendar size={24} className="text-amber-500" />,
      path: "/laundry",
      color: "bg-amber-50"
    }
  ];

  // Warden specific cards
  const wardenCards = [
    {
      title: "Room Allocation",
      description: "Manage room allocations",
      icon: <Home size={24} className="text-cyan-500" />,
      path: "/allocations",
      color: "bg-cyan-50"
    },
    {
      title: "Student Records",
      description: "View all student records",
      icon: <Users size={24} className="text-indigo-500" />,
      path: "/students",
      color: "bg-indigo-50"
    },
    {
      title: "Pending Approvals",
      description: "Approve student requests",
      icon: <AlertTriangle size={24} className="text-orange-500" />,
      path: "/approvals",
      color: "bg-orange-50"
    }
  ];

  // Combine cards based on role
  const actionCards = [
    ...commonCards,
    ...(isStudent ? studentCards : []),
    ...(isWarden ? wardenCards : [])
  ];

  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <WelcomeCard user={user} isStudent={isStudent} />

      {/* Quick actions section */}
      <section className="hostel-section">
        <h2 className="hostel-title">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <QuickActionCard 
              key={card.title}
              title={card.title}
              description={card.description}
              icon={card.icon}
              path={card.path}
              color={card.color}
            />
          ))}
        </div>
      </section>

      {/* Status overview section */}
      <section className="hostel-section">
        <h2 className="hostel-title">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isStudent && (
            <>
              <StatusCard 
                title="Room Status" 
                value="Active" 
                description={`Room ${user?.roomNumber}`} 
              />
              <StatusCard 
                title="Pending Complaints" 
                value="1" 
                description="Last updated 2 days ago" 
              />
              <StatusCard 
                title="Outings This Month" 
                value="4" 
                description="7 hours total" 
              />
            </>
          )}
          {isWarden && (
            <>
              <StatusCard 
                title="Total Students" 
                value="248" 
                description="16 new this month" 
              />
              <StatusCard 
                title="Active Complaints" 
                value="12" 
                description="4 pending approval" 
              />
              <StatusCard 
                title="Students on Outing" 
                value="23" 
                description="Updated just now" 
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
