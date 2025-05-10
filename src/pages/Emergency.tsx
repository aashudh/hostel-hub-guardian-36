
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Phone, 
  Bell, 
  Shield, 
  User,
  AlertTriangle,
  PhoneCall
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock emergency contacts
const HOSTEL_EMERGENCY_CONTACTS = [
  {
    id: "hostel-1",
    name: "Hostel Warden",
    role: "Emergency Contact",
    phone: "555-123-4567",
    email: "warden@hostel.edu",
    available: "24/7"
  },
  {
    id: "hostel-2",
    name: "Campus Security",
    role: "Security Services",
    phone: "555-911-0000",
    email: "security@campus.edu",
    available: "24/7"
  },
  {
    id: "hostel-3",
    name: "Medical Center",
    role: "Health Services",
    phone: "555-123-9876",
    email: "health@campus.edu",
    available: "8am - 8pm"
  }
];

// Mock personal emergency contacts
const MOCK_PERSONAL_CONTACTS = [
  {
    id: "personal-1",
    name: "Robert Johnson",
    relationship: "Parent",
    phone: "555-888-1234",
    email: "robert@email.com"
  },
  {
    id: "personal-2",
    name: "Emily Smith",
    relationship: "Sibling",
    phone: "555-777-5678",
    email: "emily@email.com"
  }
];

export default function Emergency() {
  const { user, isWarden, isStudent } = useAuth();
  const [personalContacts, setPersonalContacts] = useState(MOCK_PERSONAL_CONTACTS);
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: ""
  });
  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyDescription, setEmergencyDescription] = useState("");

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.relationship || !formData.phone) {
      toast.error("Please fill all required fields");
      return;
    }

    // Create new contact
    const newContact = {
      id: `personal-${Date.now()}`,
      name: formData.name,
      relationship: formData.relationship,
      phone: formData.phone,
      email: formData.email
    };

    if (personalContacts.length >= 3) {
      toast.error("You can only add up to 3 emergency contacts");
      return;
    }

    setPersonalContacts([...personalContacts, newContact]);
    
    // Reset form
    setFormData({
      name: "",
      relationship: "",
      phone: "",
      email: ""
    });

    toast.success("Emergency contact added successfully!");
  };

  const handleDeleteContact = (id: string) => {
    setPersonalContacts(personalContacts.filter(contact => contact.id !== id));
    toast.success("Emergency contact removed");
  };

  const handleEmergencyAlert = () => {
    if (!emergencyType) {
      toast.error("Please select an emergency type");
      return;
    }

    toast.success("Emergency alert sent! Help is on the way.");
    
    // In a real application, this would send notifications to the selected contacts
    // and notify hostel administration
    
    setEmergencyType("");
    setEmergencyDescription("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Emergency Management</h1>
        <p className="text-muted-foreground">Access emergency contacts and send alerts</p>
      </div>

      {isStudent && (
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={20} /> Emergency Alert
            </CardTitle>
            <CardDescription>
              Use this feature only in case of genuine emergencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyType">Emergency Type</Label>
                <select 
                  id="emergencyType"
                  className="w-full px-3 py-2 border rounded-md"
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                >
                  <option value="">Select emergency type</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="security">Security Threat</option>
                  <option value="fire">Fire Emergency</option>
                  <option value="other">Other Emergency</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyDescription">Description (Optional)</Label>
                <Input 
                  id="emergencyDescription"
                  placeholder="Briefly describe your emergency"
                  value={emergencyDescription}
                  onChange={(e) => setEmergencyDescription(e.target.value)}
                />
              </div>
              
              <Button 
                className="w-full bg-red-500 hover:bg-red-600" 
                onClick={handleEmergencyAlert}
              >
                <Bell className="mr-2" size={16} />
                Send Emergency Alert
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                This will alert hostel authorities and your emergency contacts
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={isStudent ? "personal" : "hostel"} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="hostel">Hostel Contacts</TabsTrigger>
          <TabsTrigger value="personal">Personal Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hostel" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {HOSTEL_EMERGENCY_CONTACTS.map((contact) => (
              <Card key={contact.id} className="hover:shadow-sm transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield size={18} className="text-hostel-blue" />
                    {contact.name}
                  </CardTitle>
                  <CardDescription>{contact.role}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-muted-foreground" />
                      <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                        {contact.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                      <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Available: {contact.available}</span>
                    <Button size="sm" variant="outline">
                      <PhoneCall size={14} className="mr-1" />
                      Call
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="personal" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Emergency Contacts</h2>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-hostel-blue hover:bg-hostel-dark" disabled={personalContacts.length >= 3}>
                  Add Contact
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Add Emergency Contact</DialogTitle>
                  <DialogDescription>
                    Add up to three people who should be contacted in case of emergency.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="Contact's full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Input 
                      id="relationship" 
                      name="relationship"
                      value={formData.relationship}
                      onChange={handleFormChange}
                      placeholder="e.g. Parent, Sibling, Guardian"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleFormChange}
                      placeholder="Emergency contact phone"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <Input 
                      id="email" 
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="Contact's email address"
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Add Contact</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          {personalContacts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-10">
                <p className="text-muted-foreground">No emergency contacts added yet</p>
                <Button variant="outline" className="mt-4">Add Your First Contact</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {personalContacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User size={18} />
                      {contact.name}
                    </CardTitle>
                    <CardDescription>{contact.relationship}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone size={16} className="text-muted-foreground" />
                        <a href={`tel:${contact.phone}`} className="text-sm hover:underline">
                          {contact.phone}
                        </a>
                      </div>
                      {contact.email && (
                        <div className="flex items-center gap-2">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                            <rect x="2" y="4" width="20" height="16" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                          <a href={`mailto:${contact.email}`} className="text-sm hover:underline">
                            {contact.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Priority #{personalContacts.findIndex(c => c.id === contact.id) + 1}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <PhoneCall size={14} className="mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteContact(contact.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
