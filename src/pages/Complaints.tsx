import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Complaint } from "@/types/complaint";

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: "1",
    title: "Noise Complaint",
    category: "Noise",
    description: "Loud music at night",
    status: "pending",
    createdAt: "2024-01-20T10:00:00Z",
  },
  {
    id: "2",
    title: "Cleanliness",
    category: "Hygiene",
    description: "Dirty washrooms",
    status: "in-progress",
    createdAt: "2024-01-15T14:30:00Z",
    resolvedAt: "2024-01-22T14:30:00Z",
    response: "Washrooms cleaned"
  },
  {
    id: "3",
    title: "Mess Food Quality",
    category: "Food",
    description: "Poor food quality",
    status: "resolved",
    createdAt: "2024-01-10T08:00:00Z",
    resolvedAt: "2024-01-18T08:00:00Z",
    response: "Menu changed"
  },
  {
    id: "4",
    title: "Water Leakage",
    category: "Maintenance",
    description: "Water leaking from ceiling",
    status: "pending",
    createdAt: "2024-01-25T16:00:00Z",
  },
  {
    id: "5",
    title: "Pest Control",
    category: "Hygiene",
    description: "Cockroaches in room",
    status: "in-progress",
    createdAt: "2024-02-01T12:00:00Z",
    resolvedAt: "2024-02-05T12:00:00Z",
    response: "Pest control done"
  },
];

export default function Complaints() {
  const { user, isWarden } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>(MOCK_COMPLAINTS);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    category: "",
    description: ""
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewComplaint(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitComplaint = () => {
    if (!newComplaint.title || !newComplaint.category || !newComplaint.description) {
      toast.error("Please fill all fields");
      return;
    }

    const newComplaintWithDefaults: Complaint = {
      id: Date.now().toString(),
      title: newComplaint.title,
      category: newComplaint.category,
      description: newComplaint.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setComplaints(prev => [newComplaintWithDefaults, ...prev]);
    setNewComplaint({ title: "", category: "", description: "" });
    toast.success("Complaint submitted successfully!");
  };

  const handleUpdateComplaintStatus = (id: string, status: string, response?: string) => {
    setComplaints(prev => prev.map(complaint => {
      if (complaint.id === id) {
        return {
          ...complaint,
          status,
          ...(status === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
          ...(response ? { response } : {})
        };
      }
      return complaint;
    }));
    
    toast.success(`Complaint status updated to ${status}`);
  };

  const filterComplaints = (complaint: Complaint) => {
    const statusMatch = statusFilter === "all" || complaint.status === statusFilter;
    const categoryMatch = categoryFilter === "all" || complaint.category === categoryFilter;
    return statusMatch && categoryMatch;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Complaints Management</h1>
        <p className="text-muted-foreground">Submit and track your complaints</p>
      </div>

      <Tabs defaultValue="my-complaints" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
          {isWarden && <TabsTrigger value="all-complaints">All Complaints</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="my-complaints" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Complaints</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-hostel-blue hover:bg-hostel-dark">
                  Submit Complaint
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Submit a Complaint</DialogTitle>
                  <DialogDescription>
                    Please provide details of your complaint.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input 
                      id="title" 
                      name="title"
                      value={newComplaint.title}
                      onChange={handleInputChange}
                      placeholder="Complaint title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => setNewComplaint(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" defaultValue={newComplaint.category} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Noise">Noise</SelectItem>
                        <SelectItem value="Hygiene">Hygiene</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Maintenance">Maintenance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description"
                      value={newComplaint.description}
                      onChange={handleInputChange}
                      placeholder="Describe your complaint"
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" onClick={handleSubmitComplaint}>Submit</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {complaints.filter(filterComplaints).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No complaints submitted yet</p>
                <Button variant="outline" className="mt-4">Submit Your First Complaint</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Filter Complaints</h3>
                <div className="flex space-x-2">
                  <Select onValueChange={(value) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" defaultValue={statusFilter} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select onValueChange={(value) => setCategoryFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" defaultValue={categoryFilter} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Noise">Noise</SelectItem>
                      <SelectItem value="Hygiene">Hygiene</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {complaints.filter(filterComplaints).map((complaint) => (
                <Card key={complaint.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription>{complaint.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p>{complaint.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-medium">Status: {complaint.status}</span>
                      {complaint.status === "resolved" ? (
                        <span className="text-xs text-green-500">Resolved on {new Date(complaint.resolvedAt || '').toLocaleDateString()}</span>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          {complaint.status === "pending" ? "Pending" : "In Progress"}
                        </Button>
                      )}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {isWarden && (
          <TabsContent value="all-complaints" className="mt-6">
            <h2 className="text-lg font-medium mb-4">All Complaints</h2>
            {complaints.map((complaint) => (
              <Card key={complaint.id} className="mb-4">
                <CardHeader>
                  <CardTitle>{complaint.title}</CardTitle>
                  <CardDescription>{complaint.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{complaint.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Submitted on {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    Status: {complaint.status}
                    {complaint.status === "resolved" && (
                      <p className="text-sm text-green-500">
                        Resolved on {new Date(complaint.resolvedAt || '').toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {complaint.status !== "resolved" ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Update Status</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Update Complaint Status</DialogTitle>
                          <DialogDescription>
                            Select the new status for this complaint.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right">
                              Status
                            </Label>
                            <Select onValueChange={(value) => handleUpdateComplaintStatus(complaint.id, value)} defaultValue={complaint.status}>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="resolved">Resolved</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {complaint.status === "in-progress" && (
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="response" className="text-right">
                                Response
                              </Label>
                              <Textarea
                                id="response"
                                className="col-span-3"
                                placeholder="Enter your response"
                                onChange={(e) => handleUpdateComplaintStatus(complaint.id, complaint.status, e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
