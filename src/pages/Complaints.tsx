
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  Search
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock complaints data
const MOCK_COMPLAINTS = [
  {
    id: "complaint-1",
    title: "Water supply issue",
    category: "water",
    description: "No water in bathroom taps since morning. Please look into this urgently.",
    status: "resolved",
    createdAt: "2025-05-05T10:30:00",
    resolvedAt: "2025-05-05T16:45:00",
    response: "Issue has been fixed. The water pump was faulty and has been replaced.",
  },
  {
    id: "complaint-2",
    title: "Electricity fluctuations",
    category: "electricity",
    description: "There have been frequent power cuts and voltage fluctuations in our block.",
    status: "in-progress",
    createdAt: "2025-05-07T14:30:00",
    response: "Our electrical team is looking into the issue. We'll update you soon.",
  },
  {
    id: "complaint-3",
    title: "Poor food quality",
    category: "food",
    description: "The food quality in the mess has deteriorated. Today's lunch was stale.",
    status: "pending",
    createdAt: "2025-05-09T08:15:00",
  }
];

const COMPLAINT_CATEGORIES = [
  { value: "food", label: "Food Quality" },
  { value: "water", label: "Water Supply" },
  { value: "electricity", label: "Electricity" },
  { value: "internet", label: "Internet Connectivity" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "security", label: "Security" },
  { value: "maintenance", label: "Maintenance" },
  { value: "others", label: "Others" }
];

export default function Complaints() {
  const { user, isWarden, isStudent } = useAuth();
  const [complaints, setComplaints] = useState(MOCK_COMPLAINTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: ""
  });
  const [responseText, setResponseText] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create new complaint
    const newComplaint = {
      id: `complaint-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      description: formData.description,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setComplaints([newComplaint, ...complaints]);
    
    // Reset form
    setFormData({
      title: "",
      category: "",
      description: ""
    });

    toast.success("Complaint submitted successfully!");
  };

  const handleUpdateComplaintStatus = (complaintId: string, newStatus: string) => {
    setComplaints(prev => 
      prev.map(complaint => 
        complaint.id === complaintId 
          ? { 
              ...complaint, 
              status: newStatus, 
              ...(newStatus === "resolved" ? { resolvedAt: new Date().toISOString() } : {}),
              ...(responseText ? { response: responseText } : {})
            } 
          : complaint
      )
    );
    setResponseText("");
    toast.success(`Complaint status updated to ${newStatus}`);
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Resolved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-gray-500" />;
      case 'in-progress':
        return <AlertTriangle size={18} className="text-blue-500" />;
      case 'resolved':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <MessageSquare size={18} />;
    }
  };

  // Filter complaints based on search and status
  const filteredComplaints = complaints.filter(complaint => {
    const matchesSearch = complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         complaint.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || complaint.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Complaints System</h1>
          <p className="text-muted-foreground">Submit and track your complaints and grievances</p>
        </div>
        
        {isStudent && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-hostel-blue hover:bg-hostel-dark">
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
                <DialogDescription>
                  Provide details about your issue so we can address it promptly.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input 
                    id="title" 
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    placeholder="Brief title of your complaint"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPLAINT_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Detailed description of your complaint"
                    rows={4}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">Submit Complaint</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-auto md:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search complaints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredComplaints.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-muted-foreground">No complaints found</p>
            {isStudent && (
              <Button variant="outline" className="mt-4">Submit Your First Complaint</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint) => (
            <Card key={complaint.id} className="hover:shadow-sm transition-shadow">
              <CardHeader className="py-4">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(complaint.status)}
                      <CardTitle className="text-lg">{complaint.title}</CardTitle>
                      {getStatusBadge(complaint.status)}
                    </div>
                    <CardDescription className="mt-1">
                      Category: {COMPLAINT_CATEGORIES.find(c => c.value === complaint.category)?.label || complaint.category}
                    </CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          {selectedComplaint && (
                            <>
                              Complaint Details {getStatusBadge(selectedComplaint.status)}
                            </>
                          )}
                        </DialogTitle>
                      </DialogHeader>
                      {selectedComplaint && (
                        <div className="py-4 space-y-4">
                          <div>
                            <h3 className="font-medium">{selectedComplaint.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {COMPLAINT_CATEGORIES.find(c => c.value === selectedComplaint.category)?.label || selectedComplaint.category}
                            </p>
                          </div>
                          
                          <div className="bg-muted/50 p-4 rounded-md">
                            <p className="text-sm">{selectedComplaint.description}</p>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground gap-4">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1" />
                              Submitted: {formatDateTime(selectedComplaint.createdAt)}
                            </div>
                          </div>
                          
                          {selectedComplaint.response && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium mb-2">Response:</h4>
                              <p className="text-sm p-3 bg-muted/50 rounded-md">{selectedComplaint.response}</p>
                              
                              {selectedComplaint.resolvedAt && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  Resolved on: {formatDateTime(selectedComplaint.resolvedAt)}
                                </p>
                              )}
                            </div>
                          )}
                          
                          {isWarden && selectedComplaint.status !== 'resolved' && selectedComplaint.status !== 'rejected' && (
                            <div className="border-t pt-4 mt-4">
                              <h4 className="font-medium mb-2">Update Status:</h4>
                              <Textarea 
                                placeholder="Add a response (optional)"
                                value={responseText}
                                onChange={(e) => setResponseText(e.target.value)}
                                className="mb-4"
                              />
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, "in-progress")}
                                  className="bg-blue-500 hover:bg-blue-600"
                                >
                                  Mark In Progress
                                </Button>
                                <Button 
                                  onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, "resolved")}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Resolve
                                </Button>
                                <Button 
                                  onClick={() => handleUpdateComplaintStatus(selectedComplaint.id, "rejected")}
                                  variant="destructive"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="py-0">
                <p className="text-sm line-clamp-2">{complaint.description}</p>
              </CardContent>
              <CardFooter className="pt-4 pb-4">
                <div className="flex justify-between w-full items-center text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-1" /> {formatDateTime(complaint.createdAt)}
                  </div>
                  {complaint.status === 'resolved' && (
                    <Badge variant="outline" className="text-green-600">
                      Resolved in {Math.floor((new Date(complaint.resolvedAt).getTime() - new Date(complaint.createdAt).getTime()) / (1000 * 60 * 60))} hours
                    </Badge>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
