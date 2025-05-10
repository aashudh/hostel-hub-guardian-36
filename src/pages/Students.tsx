
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Students() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Student Records</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Student record management features will be implemented in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
