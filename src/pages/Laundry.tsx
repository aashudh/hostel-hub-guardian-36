
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Calendar, Clock, CheckCircle, AlarmClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

// Mock laundry data
const MOCK_LAUNDRY_SESSIONS = [
  {
    id: "laundry-1",
    machineNumber: "W-02",
    startTime: "2025-05-08T10:30:00",
    endTime: "2025-05-08T12:00:00",
    status: "completed",
    laundryType: "Regular",
    itemCount: 12
  },
  {
    id: "laundry-2",
    machineNumber: "W-04",
    startTime: "2025-05-05T14:15:00",
    endTime: "2025-05-05T15:45:00",
    status: "completed",
    laundryType: "Delicate",
    itemCount: 5
  },
  {
    id: "laundry-3",
    machineNumber: "W-01",
    startTime: "2025-05-10T09:00:00",
    endTime: "2025-05-10T10:30:00",
    status: "active",
    laundryType: "Regular",
    itemCount: 8
  }
];

// Mock machines data
const MOCK_MACHINES = [
  { id: "W-01", type: "Washer", status: "busy", availableAt: "10:30 AM" },
  { id: "W-02", type: "Washer", status: "available", availableAt: "Now" },
  { id: "W-03", type: "Washer", status: "maintenance", availableAt: "Under Maintenance" },
  { id: "W-04", type: "Washer", status: "available", availableAt: "Now" },
  { id: "D-01", type: "Dryer", status: "busy", availableAt: "10:15 AM" },
  { id: "D-02", type: "Dryer", status: "available", availableAt: "Now" },
  { id: "D-03", type: "Dryer", status: "available", availableAt: "Now" },
];

const LAUNDRY_TYPES = [
  "Regular",
  "Delicate",
  "Heavy Duty",
  "Quick Wash"
];

export default function Laundry() {
  const { user } = useAuth();
  const [laundrySessions, setLaundrySessions] = useState(MOCK_LAUNDRY_SESSIONS);
  const [machines, setMachines] = useState(MOCK_MACHINES);
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    laundryType: "Regular",
    itemCount: "",
    startTime: ""
  });

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMachine || !formData.laundryType || !formData.itemCount || !formData.startTime) {
      toast.error("Please fill all required fields");
      return;
    }

    const now = new Date();
    const startTime = new Date(formData.startTime);
    
    // Create estimated end time (90 minutes after start)
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + 90);

    // Create new laundry session
    const newSession = {
      id: `laundry-${Date.now()}`,
      machineNumber: selectedMachine,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      status: startTime <= now ? "active" : "scheduled",
      laundryType: formData.laundryType,
      itemCount: parseInt(formData.itemCount)
    };

    setLaundrySessions([newSession, ...laundrySessions]);
    
    // Update machine status
    setMachines(machines.map(machine => 
      machine.id === selectedMachine 
        ? { ...machine, status: "busy", availableAt: endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
        : machine
    ));
    
    // Reset form
    setFormData({
      laundryType: "Regular",
      itemCount: "",
      startTime: ""
    });
    setSelectedMachine(null);

    toast.success("Laundry session registered successfully!");
  };

  const handleCompleteSession = (sessionId: string) => {
    // Find the session
    const session = laundrySessions.find(s => s.id === sessionId);
    if (!session) return;
    
    // Update session status
    setLaundrySessions(laundrySessions.map(s => 
      s.id === sessionId ? { ...s, status: "completed" } : s
    ));
    
    // Update machine status
    setMachines(machines.map(machine => 
      machine.id === session.machineNumber 
        ? { ...machine, status: "available", availableAt: "Now" } 
        : machine
    ));
    
    toast.success("Laundry session marked as completed!");
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getMachineStatusBadge = (status: string) => {
    switch (status) {
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'busy':
        return <Badge className="bg-yellow-500">In Use</Badge>;
      case 'maintenance':
        return <Badge variant="destructive">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeSession = laundrySessions.find(s => s.status === "active");
  const availableMachines = machines.filter(m => m.status === "available");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Laundry Management</h1>
          <p className="text-muted-foreground">Track and schedule your laundry sessions</p>
        </div>
        
        {!activeSession && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-hostel-blue hover:bg-hostel-dark">
                Schedule Laundry
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Schedule a Laundry Session</DialogTitle>
                <DialogDescription>
                  Book a washing machine for your laundry needs
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="machine">Select Machine</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {machines
                      .filter(m => m.type === "Washer" && m.status === "available")
                      .map(machine => (
                        <Button
                          key={machine.id}
                          type="button"
                          variant={selectedMachine === machine.id ? "default" : "outline"}
                          className={`justify-start ${selectedMachine === machine.id ? 'border-2 border-hostel-blue' : ''}`}
                          onClick={() => setSelectedMachine(machine.id)}
                        >
                          <div className="flex items-center gap-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                              <rect x="7" y="5" width="10" height="10" rx="5" stroke="currentColor" strokeWidth="2" />
                              <path d="M7 19H17" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {machine.id}
                          </div>
                        </Button>
                      ))}
                  </div>
                  {availableMachines.length === 0 && (
                    <p className="text-sm text-amber-500">No machines available right now</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="laundryType">Laundry Type</Label>
                  <select
                    id="laundryType"
                    name="laundryType"
                    value={formData.laundryType}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {LAUNDRY_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="itemCount">Number of Items</Label>
                  <Input 
                    id="itemCount" 
                    name="itemCount"
                    type="number"
                    value={formData.itemCount}
                    onChange={handleFormChange}
                    min="1"
                    max="30"
                    placeholder="How many items?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input 
                    id="startTime" 
                    name="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleFormChange}
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={!selectedMachine || !formData.laundryType || !formData.itemCount || !formData.startTime}
                  >
                    Schedule Session
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeSession && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Active Laundry Session</CardTitle>
                <CardDescription>Machine {activeSession.machineNumber}</CardDescription>
              </div>
              <Button 
                onClick={() => handleCompleteSession(activeSession.id)} 
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="mr-2" size={16} />
                Mark Complete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                <p className="font-medium">{formatDateTime(activeSession.startTime)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Expected Completion</h3>
                <p className="font-medium">{formatDateTime(activeSession.endTime)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remaining Time</h3>
                <p className="font-medium">
                  {Math.max(0, Math.floor((new Date(activeSession.endTime).getTime() - Date.now()) / (1000 * 60)))} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="machines" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="machines">Machines</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="machines" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {machines.map((machine) => (
              <Card key={machine.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{machine.id}</CardTitle>
                    {getMachineStatusBadge(machine.status)}
                  </div>
                  <CardDescription>{machine.type}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-muted-foreground" />
                      <span className="text-sm">Available: {machine.availableAt}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    disabled={machine.status !== "available"}
                  >
                    {machine.status === "available" ? "Book Now" : "Unavailable"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          {laundrySessions.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No laundry sessions yet</p>
                <Button variant="outline" className="mt-4">Schedule Your First Session</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {laundrySessions.map((session) => (
                <Card key={session.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <AlarmClock size={18} className="text-hostel-blue" />
                        <CardTitle className="text-lg">Machine {session.machineNumber}</CardTitle>
                      </div>
                      {getStatusBadge(session.status)}
                    </div>
                    <CardDescription>{session.laundryType} wash ({session.itemCount} items)</CardDescription>
                  </CardHeader>
                  <CardContent className="py-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Start Time</h3>
                        <p className="text-sm">{formatDateTime(session.startTime)}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">End Time</h3>
                        <p className="text-sm">{formatDateTime(session.endTime)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4">
                    <div className="w-full flex justify-end">
                      {session.status === "active" && (
                        <Button
                          size="sm" 
                          className="bg-green-500 hover:bg-green-600"
                          onClick={() => handleCompleteSession(session.id)}
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="usage" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Laundry Usage Statistics</CardTitle>
              <CardDescription>Your laundry usage summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Total Sessions</p>
                  <h3 className="text-3xl font-bold mt-2">{laundrySessions.length}</h3>
                  <p className="text-sm text-muted-foreground mt-1">This semester</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Total Items Washed</p>
                  <h3 className="text-3xl font-bold mt-2">
                    {laundrySessions.reduce((sum, session) => sum + session.itemCount, 0)}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">All sessions</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Preferred Machine</p>
                  <h3 className="text-lg font-medium mt-2">
                    {(() => {
                      const machines = laundrySessions.map(s => s.machineNumber);
                      const counts: Record<string, number> = {};
                      let maxMachine = "";
                      let maxCount = 0;
                      
                      machines.forEach(machine => {
                        counts[machine] = (counts[machine] || 0) + 1;
                        if (counts[machine] > maxCount) {
                          maxMachine = machine;
                          maxCount = counts[machine];
                        }
                      });
                      
                      return maxMachine || "None";
                    })()}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Most frequently used</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Laundry Type Distribution</h3>
                <div className="space-y-4">
                  {LAUNDRY_TYPES.map(type => {
                    const count = laundrySessions.filter(s => s.laundryType === type).length;
                    const percentage = laundrySessions.length > 0 
                      ? Math.round((count / laundrySessions.length) * 100) 
                      : 0;
                    
                    return (
                      <div key={type} className="space-y-2">
                        <div className="flex justify-between">
                          <span>{type}</span>
                          <span>{count} sessions ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5">
                          <div 
                            className="bg-hostel-blue h-2.5 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
