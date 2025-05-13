
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock, Info, ArrowRightLeft, Shield, Key } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  InputOTP,
  InputOTPGroup,
  InputOTPSlot
} from "@/components/ui/input-otp";

// Mock outing data
const MOCK_OUTINGS = [
  {
    id: "outing-1",
    outTime: "2025-05-08T14:30:00",
    inTime: "2025-05-08T18:45:00",
    purpose: "Shopping for essentials at the nearby mall",
    status: "completed",
    destination: "City Center Mall",
    parentPhone: "+91 9876543210"
  },
  {
    id: "outing-2",
    outTime: "2025-05-05T09:15:00",
    inTime: "2025-05-05T15:20:00",
    purpose: "Medical appointment at City Hospital",
    status: "completed",
    destination: "City Hospital",
    parentPhone: "+91 9876543210"
  },
  {
    id: "outing-3",
    outTime: "2025-05-10T11:00:00",
    inTime: null,
    purpose: "Project meeting with classmates",
    status: "active",
    destination: "University Library",
    parentPhone: "+91 9876543210"
  }
];

export default function Outings() {
  const { user } = useAuth();
  const [outings, setOutings] = useState(MOCK_OUTINGS);
  const [formData, setFormData] = useState({
    purpose: "",
    destination: "",
    outTime: "",
    expectedReturn: "",
    parentPhone: ""
  });
  const [selectedOuting, setSelectedOuting] = useState<any>(null);
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpVerificationStatus, setOtpVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");
  const [otpExpiryTime, setOtpExpiryTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.purpose || !formData.destination || !formData.outTime || !formData.parentPhone) {
      toast.error("Please fill all required fields");
      return;
    }

    // Generate OTP and show the OTP verification dialog
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpExpiryTime(Date.now() + 60 * 1000); // 1 minute expiry
    setTimeLeft(60);
    setIsOtpDialogOpen(true);

    // Mock sending OTP to parent's phone
    toast.info(`OTP sent to parent's phone: ${formData.parentPhone}`, {
      description: `For demo purposes, the OTP is: ${newOtp}`,
      duration: 5000,
    });

    // Start countdown timer
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOtp = () => {
    setOtpVerificationStatus("verifying");
    
    setTimeout(() => {
      if (otpExpiryTime && Date.now() > otpExpiryTime) {
        setOtpVerificationStatus("failed");
        toast.error("OTP has expired. Please request a new one.");
        return;
      }

      if (otp === generatedOtp) {
        setOtpVerificationStatus("success");
        toast.success("OTP verification successful!");
        
        // Create new outing after OTP verification
        setTimeout(() => {
          const newOuting = {
            id: `outing-${Date.now()}`,
            outTime: new Date(formData.outTime).toISOString(),
            inTime: null,
            purpose: formData.purpose,
            status: "active",
            destination: formData.destination,
            parentPhone: formData.parentPhone
          };
      
          setOutings([newOuting, ...outings]);
          
          // Reset form
          setFormData({
            purpose: "",
            destination: "",
            outTime: "",
            expectedReturn: "",
            parentPhone: ""
          });
      
          setIsOtpDialogOpen(false);
          setOtp("");
          setOtpVerificationStatus("idle");
          
          toast.success("Outing registered successfully!");
        }, 1000);
      } else {
        setOtpVerificationStatus("failed");
        toast.error("Invalid OTP. Please try again.");
      }
    }, 1500);
  };

  const handleReturnNow = (outingId: string) => {
    setOutings(prev => 
      prev.map(outing => 
        outing.id === outingId 
          ? { ...outing, inTime: new Date().toISOString(), status: "completed" } 
          : outing
      )
    );
    toast.success("Welcome back! Return time recorded.");
  };

  const formatDateTime = (dateTimeString: string | null) => {
    if (!dateTimeString) return "Not yet returned";
    
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
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const activeOuting = outings.find(o => o.status === "active");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Outing Management</h1>
          <p className="text-muted-foreground">Track and register your outings from the hostel</p>
        </div>
        
        {!activeOuting && (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-hostel-blue hover:bg-hostel-dark">
                Register New Outing
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register an Outing</DialogTitle>
                <DialogDescription>
                  Provide details about where you're going and when you expect to return.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    name="destination"
                    value={formData.destination}
                    onChange={handleFormChange}
                    placeholder="Where are you going?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose of Outing</Label>
                  <Textarea 
                    id="purpose" 
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleFormChange}
                    placeholder="Briefly describe the purpose of your outing"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="outTime">Out Time</Label>
                    <Input 
                      id="outTime" 
                      name="outTime"
                      type="datetime-local"
                      value={formData.outTime}
                      onChange={handleFormChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected Return (Optional)</Label>
                    <Input 
                      id="expectedReturn" 
                      name="expectedReturn"
                      type="datetime-local"
                      value={formData.expectedReturn}
                      onChange={handleFormChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="parentPhone">Parent's Phone Number</Label>
                  <Input 
                    id="parentPhone" 
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleFormChange}
                    placeholder="+91 9876543210"
                    required
                  />
                  <p className="text-xs text-muted-foreground">OTP will be sent to this number for verification</p>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">Request Outing</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* OTP Verification Dialog */}
      <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Verify OTP</DialogTitle>
            <DialogDescription>
              An OTP has been sent to your parent's phone number. Please enter the 6-digit code below to verify.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6 flex flex-col items-center">
            <div className="mb-6">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {timeLeft > 0 ? (
              <p className="text-sm flex items-center gap-1">
                <Clock size={14} /> OTP expires in <span className="font-bold">{timeLeft}</span> seconds
              </p>
            ) : (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <Clock size={14} /> OTP has expired. Please try again.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              onClick={verifyOtp} 
              disabled={otp.length !== 6 || otpVerificationStatus === "verifying" || timeLeft === 0}
              className="w-full flex items-center gap-2"
            >
              {otpVerificationStatus === "verifying" ? "Verifying..." : "Verify OTP"}
              <Key size={16} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeOuting && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>You're Currently Out</CardTitle>
                <CardDescription>Started at {formatDateTime(activeOuting.outTime)}</CardDescription>
              </div>
              <Button 
                onClick={() => handleReturnNow(activeOuting.id)} 
                className="bg-green-500 hover:bg-green-600"
              >
                I'm Back Now
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Info size={16} /> Purpose
                </h3>
                <p className="text-sm mt-1 text-muted-foreground">{activeOuting.purpose}</p>
              </div>
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  <Clock size={16} /> Out Duration
                </h3>
                <p className="text-sm mt-1 text-muted-foreground">
                  {Math.floor((Date.now() - new Date(activeOuting.outTime).getTime()) / (1000 * 60))} minutes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="history">Outing History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="mt-6">
          <div className="space-y-4">
            {outings.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <p className="text-muted-foreground">No outings recorded yet</p>
                  <Button variant="outline" className="mt-4">Register Your First Outing</Button>
                </CardContent>
              </Card>
            ) : (
              outings.map((outing) => (
                <Card key={outing.id} className="hover:shadow-sm transition-shadow">
                  <CardHeader className="py-4">
                    <div className="flex justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{outing.destination}</span>
                          {getStatusBadge(outing.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{outing.purpose}</p>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOuting(outing)}
                          >
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Outing Details</DialogTitle>
                          </DialogHeader>
                          {selectedOuting && (
                            <div className="py-4 space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground">Destination</h3>
                                  <p>{selectedOuting.destination}</p>
                                </div>
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                  <p>{getStatusBadge(selectedOuting.status)}</p>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Purpose</h3>
                                <p>{selectedOuting.purpose}</p>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-hostel-blue" /> 
                                  <div>
                                    <h3 className="text-sm font-medium">Out Time</h3>
                                    <p className="text-sm">{formatDateTime(selectedOuting.outTime)}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <ArrowRightLeft size={16} className="text-hostel-blue" /> 
                                  <div>
                                    <h3 className="text-sm font-medium">In Time</h3>
                                    <p className="text-sm">{formatDateTime(selectedOuting.inTime)}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Shield size={16} className="text-hostel-blue" /> 
                                <div>
                                  <h3 className="text-sm font-medium">Parent Contact</h3>
                                  <p className="text-sm">{selectedOuting.parentPhone}</p>
                                </div>
                              </div>
                              
                              {selectedOuting.status === 'completed' && (
                                <div>
                                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                                  <p>
                                    {Math.floor((new Date(selectedOuting.inTime).getTime() - new Date(selectedOuting.outTime).getTime()) / (1000 * 60 * 60))} hours,{' '}
                                    {Math.floor((new Date(selectedOuting.inTime).getTime() - new Date(selectedOuting.outTime).getTime()) / (1000 * 60)) % 60} minutes
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-4">
                    <div className="flex items-center text-sm text-muted-foreground gap-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDateTime(outing.outTime)}
                      </div>
                      <div className="flex items-center">
                        <ArrowRightLeft size={14} className="mr-1" />
                        {formatDateTime(outing.inTime)}
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Your Outing Statistics</CardTitle>
              <CardDescription>
                Summary of your hostel outings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Total Outings</p>
                  <h3 className="text-3xl font-bold mt-2">{outings.length}</h3>
                  <p className="text-sm text-muted-foreground mt-1">This semester</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Average Duration</p>
                  <h3 className="text-3xl font-bold mt-2">2.5h</h3>
                  <p className="text-sm text-muted-foreground mt-1">Per outing</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm font-medium">Most Common Purpose</p>
                  <h3 className="text-lg font-medium mt-2">Shopping</h3>
                  <p className="text-sm text-muted-foreground mt-1">40% of outings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
