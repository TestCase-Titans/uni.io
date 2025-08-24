import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { ArrowLeft, User, Bell, Palette, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";

interface SettingsPageProps {}

export function SettingsPage({}: SettingsPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const [notifications, setNotifications] = useState({
    eventReminders: true,
    weeklyDigest: false,
    newEvents: true,
    eventUpdates: true,
  });

  const handleProfileSave = () => {
    // In a real app, this would update the user profile
    toast.success("Profile updated successfully");
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  const isDashboard =
    user?.role === "student" ? "student-dashboard" : "admin-dashboard";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(isDashboard)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-3xl mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and notification settings
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Settings Navigation */}
          <div className="space-y-2">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4" />
                <span className="font-medium">Profile</span>
              </div>
            </div>
            <div className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </div>
            </div>
            <div className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Palette className="h-4 w-4" />
                <span>Appearance</span>
              </div>
            </div>
            <div className="p-3 hover:bg-muted rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Shield className="h-4 w-4" />
                <span>Privacy</span>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <CardTitle>Profile Information</CardTitle>
                </div>
                <CardDescription>
                  Update your personal information and account details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="capitalize font-medium">{user?.role}</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.role === "student"
                        ? "You can register for events and view your attendance history"
                        : "You can create and manage events for your organization"}
                    </p>
                  </div>
                </div>

                <Button onClick={handleProfileSave}>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive reminders about upcoming events you're registered
                      for
                    </p>
                  </div>
                  <Switch
                    checked={notifications.eventReminders}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("eventReminders", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>New Events</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when new events are published
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newEvents}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("newEvents", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Event Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about changes to registered events
                    </p>
                  </div>
                  <Switch
                    checked={notifications.eventUpdates}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("eventUpdates", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">
                      Get a weekly summary of upcoming events and activity
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyDigest}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("weeklyDigest", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>
                  Customize how the application looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select
                    value={theme}
                    onValueChange={(value: any) => setTheme(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred color scheme
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>
                  Control your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Data Protection</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your personal information is protected and only used for
                    event management purposes.
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Download My Data
                    </Button>
                    <Button variant="outline" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
