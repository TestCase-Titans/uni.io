import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label"; // Added this import
import { ArrowLeft } from "lucide-react"; // Removed unused User import
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const isDashboard =
    user?.role === "student" ? "/student-dashboard" : "/admin-dashboard";

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-2xl mx-auto">
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

          <h1 className="text-3xl mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            View your personal information and account details.
          </p>
        </div>

        {/* Profile Card */}
        <Card>
          {/* This className is now corrected for proper centering */}
          <CardHeader className="flex flex-col items-center text-center">
            {user?.img_url ? (
              <img
                src={user.img_url}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-background"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-destructive flex items-center justify-center border-4 border-background">
                <span className="text-4xl font-semibold text-destructive-foreground">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="pt-2">
              <CardTitle>{user?.name}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="p-3 bg-muted rounded-lg text-sm font-medium">
                {user?.name}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="p-3 bg-muted rounded-lg text-sm font-medium">
                {user?.email}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Account Type</Label>
              <div className="p-3 bg-muted rounded-lg">
                <span className="capitalize font-medium">{user?.role}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
