"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, DashboardSection } from "@/components/dashboard/shared";
import { FormField, DarkInput } from "@/components/dashboard/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: session, update: updateSession } = useSession();
  const userId = session?.user?.id;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    heightCm: "",
    weightKg: "",
    activityLevel: "",
  });

  useEffect(() => {
    if (userId) {
      fetch(`/api/profile?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            name: data.name || "",
            age: data.age?.toString() || "",
            gender: data.gender || "",
            heightCm: data.heightCm?.toString() || "",
            weightKg: data.weightKg?.toString() || "",
            activityLevel: data.activityLevel || "",
          });
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch profile", err);
          toast.error("Failed to load profile data");
          setLoading(false);
        });
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name,
          age: form.age ? Number(form.age) : null,
          gender: form.gender,
          heightCm: form.heightCm ? Number(form.heightCm) : null,
          weightKg: form.weightKg ? Number(form.weightKg) : null,
          activityLevel: form.activityLevel,
        }),
      });
      
      if (res.ok) {
        toast.success("Profile updated successfully");
        await updateSession({ name: form.name });
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader 
        title="Settings" 
        description="Manage your account settings and biometric profile for accurate tracking." 
      />

      <DashboardSection title="Biometric Profile" icon={User}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Full Name">
              <DarkInput 
                placeholder="John Doe" 
                value={form.name} 
                onChange={update("name")} 
              />
            </FormField>
            
            <FormField label="Age">
              <DarkInput 
                type="number" 
                placeholder="30" 
                value={form.age} 
                onChange={update("age")} 
              />
            </FormField>

            <FormField label="Gender">
              <Select 
                value={form.gender} 
                onValueChange={(val: string) => setForm(prev => ({ ...prev, gender: val }))}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Activity Level">
              <Select 
                value={form.activityLevel} 
                onValueChange={(val: string) => setForm(prev => ({ ...prev, activityLevel: val }))}
              >
                <SelectTrigger className="bg-zinc-950 border-zinc-800 text-white">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light Activity</SelectItem>
                  <SelectItem value="moderate">Moderate Activity</SelectItem>
                  <SelectItem value="active">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Height (cm)">
              <DarkInput 
                type="number" 
                placeholder="175" 
                value={form.heightCm} 
                onChange={update("heightCm")} 
              />
            </FormField>

            <FormField label="Weight (kg)">
              <DarkInput 
                type="number" 
                step="0.1" 
                placeholder="75.0" 
                value={form.weightKg} 
                onChange={update("weightKg")} 
              />
            </FormField>
          </div>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving} 
              className="bg-white text-zinc-950 hover:bg-zinc-200 font-semibold"
            >
              {saving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-zinc-950"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DashboardSection>
    </div>
  );
}
