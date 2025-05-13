
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function Profile() {
  const { user, isStudent, isWarden } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    emergencyContact1: user?.emergencyContacts?.[0] || "",
    emergencyContact2: user?.emergencyContacts?.[1] || "",
    emergencyContact3: user?.emergencyContacts?.[2] || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const emergencyContacts = [
        formData.emergencyContact1,
        formData.emergencyContact2,
        formData.emergencyContact3
      ].filter(contact => !!contact);

      if (isStudent) {
        const { error } = await supabase
          .from('students')
          .update({
            name: formData.name,
            phone: formData.phoneNumber,
            emergency_contacts: emergencyContacts
          })
          .eq('id', user.id);

        if (error) throw error;
      } else if (isWarden) {
        const { error } = await supabase
          .from('wardens')
          .update({
            name: formData.name,
            phone: formData.phoneNumber
          })
          .eq('id', user.id);

        if (error) throw error;
      }

      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully."
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Personal Information</CardTitle>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="outline"
            >
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                onClick={() => setIsEditing(false)} 
                variant="outline"
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input 
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={!isEditing}
                className={!isEditing ? "bg-gray-50" : ""}
              />
            </div>
            {isStudent && (
              <div className="space-y-2">
                <Label>Room Details</Label>
                <div className="bg-gray-50 p-2 rounded border">
                  Room {user?.roomNumber}, {user?.hostelBlock}
                </div>
              </div>
            )}
            {isWarden && (
              <div className="space-y-2">
                <Label>Hostel Block</Label>
                <div className="bg-gray-50 p-2 rounded border">
                  {user?.hostelBlock}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Emergency Contacts</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact1">Emergency Contact #1</Label>
                <Input 
                  id="emergencyContact1"
                  name="emergencyContact1"
                  value={formData.emergencyContact1}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Name and Phone Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact2">Emergency Contact #2</Label>
                <Input 
                  id="emergencyContact2"
                  name="emergencyContact2"
                  value={formData.emergencyContact2}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Name and Phone Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact3">Emergency Contact #3</Label>
                <Input 
                  id="emergencyContact3"
                  name="emergencyContact3"
                  value={formData.emergencyContact3}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                  placeholder="Name and Phone Number"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
