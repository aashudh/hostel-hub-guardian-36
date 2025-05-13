
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  color?: string;
}

export function QuickActionCard({ title, description, icon, path, color = "bg-blue-50" }: QuickActionCardProps) {
  return (
    <Link to={path}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-1">
        <CardContent className="p-0">
          <div className="flex">
            <div className={cn("flex items-center justify-center p-6 w-20", color)}>
              {icon}
            </div>
            <div className="flex flex-col justify-center py-4 px-5">
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
