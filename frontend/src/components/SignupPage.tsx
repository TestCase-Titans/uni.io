import React, { useState } from "react";
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
import apiClient from "../utils/api";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, User, Shield, Zap, Rocket, Star } from "lucide-react";
import { useAuth, type UserRole } from "../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [error, setError] = useState("");
  const { isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      const userData = {
        name,
        username,
        email,
        password,
        role,
      };

      const result = await apiClient.post("/auth/register", userData);

      if (result.status === 201) {
        onNavigate(
          role === "student" ? "student-dashboard" : "admin-dashboard"
        );
        toast.info("Verification email sent, Check your inbox!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          //  transition: Bounce,
        });
      } else {
        setError(result.data || "Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-destructive/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

      <div className="relative w-full max-w-xl animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <span className="redis-heading-md">UNI.IO</span>
          </div>
          <h1 className="redis-heading-sm mb-4">
            JOIN THE
            <br />
            <span className="text-destructive">REVOLUTION</span>
          </h1>
          <p className="redis-subtitle text-muted-foreground">
            Become part of the most epic campus event community
          </p>
        </div>

        <Card className="border-2 hover:border-destructive/20 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="redis-heading-sm">CREATE ACCOUNT</CardTitle>
            <CardDescription>
              Join thousands of students having amazing experiences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive" className="border-2">
                  <AlertDescription className="font-medium">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-bold uppercase tracking-wide text-sm"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="font-bold uppercase tracking-wide text-sm"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="preferred username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-bold uppercase tracking-wide text-sm"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-bold uppercase tracking-wide text-sm"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="font-bold uppercase tracking-wide text-sm"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Student Button (Blue) */}
                <Button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex items-center justify-center space-x-2 p-6 rounded-lg font-bold text-lg transition-all
      ${role === "student"
                      ? "bg-blue-600 text-white shadow-lg scale-105 hover:bg-blue-700 active:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:bg-blue-800"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200 active:bg-blue-300 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 dark:active:bg-blue-700"}`}
                  disabled={isLoading}
                >
                  <User className="h-5 w-5" />
                  <span>STUDENT</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                </Button>

                {/* Club Admin Button (Red) */}
                <Button
                  type="button"
                  onClick={() => setRole("clubAdmin")}
                  className={`flex items-center justify-center space-x-2 p-6 rounded-lg font-bold text-lg transition-all
      ${role === "clubAdmin"
                      ? "bg-red-600 text-white shadow-lg scale-105 hover:bg-red-700 active:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:active:bg-red-800"
                      : "bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 dark:active:bg-red-700"}`}
                  disabled={isLoading}
                >
                  <Shield className="h-5 w-5" />
                  <span>CLUB ADMIN</span>
                  <Rocket className="h-4 w-4" />
                </Button>
              </div>


              <Button
                type="submit"
                className="w-full redis-button bg-destructive hover:bg-destructive/90 py-6 text-lg animate-pulse-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    CREATING ACCOUNT...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    CREATE MY ACCOUNT
                    <Rocket className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  className="px-0 text-destructive font-bold hover:text-destructive/80"
                  onClick={() => onNavigate("login")}
                >
                  SIGN IN NOW →
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* <div className="text-center mt-8 p-4 bg-gradient-to-r from-destructive/10 to-blue-500/10 rounded-lg border border-destructive/20">
          <p className="text-xs font-bold uppercase tracking-wide text-destructive mb-2">
            🎉 JOIN THE PARTY
          </p>
          <p className="text-xs text-muted-foreground">
            Free forever • No spam • Instant access to epic events
          </p>
        </div> */}
      </div>
    </div>
  );
}
