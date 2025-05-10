
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/contexts/AuthContext";

interface WelcomeCardProps {
  user: User | null;
  isStudent: boolean;
}

export function WelcomeCard({ user, isStudent }: WelcomeCardProps) {
  return (
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
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
