
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Approvals() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Pending Approvals</h1>
      <Card>
        <CardHeader>
          <CardTitle>Approval Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Approval management features will be implemented in a future update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
