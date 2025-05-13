
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock announcements data
const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Hostel Maintenance Schedule",
    content: "The water supply will be disrupted from 10 AM to 2 PM on Sunday due to maintenance work.",
    createdAt: "2025-05-10T09:30:00",
    createdBy: "Jane Smith",
    priority: "high"
  },
  {
    id: "ann-2",
    title: "Cultural Event Registration",
    content: "Register for the annual cultural event by May 15. Participation certificates will be provided to all participants.",
    createdAt: "2025-05-08T11:45:00",
    createdBy: "Jane Smith",
    priority: "medium"
  },
  {
    id: "ann-3",
    title: "New Laundry Service Hours",
    content: "The hostel laundry service will now be available from 7 AM to 8 PM every day, including weekends.",
    createdAt: "2025-05-05T15:20:00",
    createdBy: "Jane Smith",
    priority: "low"
  }
];

export default function Announcements() {
  const { user, isWarden } = useAuth();
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    priority: "medium"
  });
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error("Please fill out all required fields");
      return;
    }
    
    const newAnnouncement = {
      id: `ann-${Date.now()}`,
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString(),
      createdBy: user?.name || "Admin",
      priority: formData.priority
    };
    
    setAnnouncements([newAnnouncement, ...announcements]);
    setFormData({
      title: "",
      content: "",
      priority: "medium"
    });
    
    toast.success("Announcement published successfully!");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-amber-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>Medium</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-muted-foreground">Stay updated with important hostel announcements</p>
        </div>
      </div>
      
      {isWarden && (
        <Card>
          <CardHeader>
            <CardTitle>Create Announcement</CardTitle>
            <CardDescription>Publish a new announcement for all students</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="font-medium">Title</label>
                <Input 
                  id="title" 
                  name="title" 
                  value={formData.title} 
                  onChange={handleFormChange} 
                  placeholder="Enter announcement title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="content" className="font-medium">Content</label>
                <Textarea 
                  id="content" 
                  name="content" 
                  value={formData.content} 
                  onChange={handleFormChange}
                  placeholder="Enter announcement details"
                  rows={5}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="priority" className="font-medium">Priority</label>
                <select 
                  id="priority" 
                  name="priority" 
                  value={formData.priority} 
                  onChange={handleFormChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <Button type="submit" className="bg-hostel-blue hover:bg-hostel-dark">
                Publish Announcement
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="important">Important</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <Card key={announcement.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Bell size={18} className="text-hostel-blue" /> {announcement.title}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        Posted on {formatDate(announcement.createdAt)}
                        {getPriorityBadge(announcement.priority)}
                      </CardDescription>
                    </div>
                    
                    {isWarden && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this announcement? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => {
                                setAnnouncements(prev => prev.filter(a => a.id !== announcement.id));
                                toast.success("Announcement deleted");
                              }}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="whitespace-pre-wrap">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="important" className="mt-6">
          <div className="space-y-4">
            {announcements
              .filter(a => a.priority === "high")
              .map((announcement) => (
                <Card key={announcement.id} className="overflow-hidden border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Bell size={18} className="text-red-500" /> {announcement.title}
                        </CardTitle>
                        <CardDescription>Posted on {formatDate(announcement.createdAt)}</CardDescription>
                      </div>
                      {getPriorityBadge(announcement.priority)}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
            {!announcements.some(a => a.priority === "high") && (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No important announcements at this time</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="space-y-4">
            {[...announcements]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map((announcement) => (
                <Card key={announcement.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-lg">{announcement.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          Posted on {formatDate(announcement.createdAt)}
                          {getPriorityBadge(announcement.priority)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="whitespace-pre-wrap">{announcement.content}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
