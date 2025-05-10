
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Link } from "react-router-dom";

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
      <Card className="border-l-4 border-l-hostel-blue">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Welcome, {user?.name}!</h2>
              <p className="text-muted-foreground mt-1">
                {isStudent ? `Room: ${user?.roomNumber}, ${user?.hostelBlock}` : `Role: Hostel Warden, ${user?.hostelBlock}`}
              </p>
            </div>
            <div className="hidden md:block">
              {/* Current date and time */}
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick actions section */}
      <section className="hostel-section">
        <h2 className="hostel-title">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actionCards.map((card) => (
            <Link key={card.title} to={card.path} className="block">
              <Card className={`h-full transition-all hover:shadow-md hover:scale-[1.01] ${card.color} border-none`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    {card.icon}
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path>
                      </svg>
                    </Button>
                  </div>
                  <CardTitle className="mt-4">{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Status overview section */}
      <section className="hostel-section">
        <h2 className="hostel-title">Status Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isStudent && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Room Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Active</div>
                  <p className="text-sm text-muted-foreground">Room {user?.roomNumber}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pending Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-sm text-muted-foreground">Last updated 2 days ago</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Outings This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-sm text-muted-foreground">7 hours total</p>
                </CardContent>
              </Card>
            </>
          )}
          {isWarden && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-sm text-muted-foreground">16 new this month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Active Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-sm text-muted-foreground">4 pending approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Students on Outing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-sm text-muted-foreground">Updated just now</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
