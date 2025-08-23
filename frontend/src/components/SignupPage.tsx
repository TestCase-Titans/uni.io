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
import axios from "axios";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, User, Shield, Zap, Rocket, Star } from "lucide-react";
import { useAuth, type UserRole } from "../contexts/AuthContext";

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
  const { signup, isLoading } = useAuth();

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

      const API_PREFIX = "http://localhost:5000/api/v1";

      const result = await axios.post(API_PREFIX + "/auth/register", userData);

      if (result.status === 201) {
        onNavigate(
          role === "student" ? "student-dashboard" : "admin-dashboard"
        );
      } else {
        setError(result.data || "Failed to create account. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-destructive/10 rounded-full blur-3xl animate-pulse-glow"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-destructive rounded-xl flex items-center justify-center mr-4 animate-bounce-gentle">
              <span className="text-destructive-foreground font-black text-3xl">
                E
              </span>
            </div>
            <span className="redis-heading-md">EVENTIFY</span>
          </div>
          <h1 className="redis-heading-md mb-4">
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
                  placeholder="Your awesome name"
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
                  placeholder="Your unique username"
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
                  placeholder="your.email@university.edu"
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

              <div className="space-y-3">
                <Label className="font-bold uppercase tracking-wide text-sm">
                  CHOOSE YOUR ADVENTURE
                </Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as UserRole)}
                  disabled={isLoading}
                  className="space-y-3"
                >
                  <div className="relative">
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:border-destructive/30">
                      <RadioGroupItem value="student" id="student" />
                      <User className="h-5 w-5 text-blue-500" />
                      <div className="flex-1">
                        <Label
                          htmlFor="student"
                          className="cursor-pointer font-bold"
                        >
                          STUDENT
                        </Label>
                        <p className="text-xs text-muted-foreground font-medium">
                          Discover and join amazing events on campus
                        </p>
                      </div>
                      <Star className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>

                  <div className="relative">
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-all cursor-pointer hover:border-destructive/30">
                      <RadioGroupItem value="ClubAdmin" id="ClubAdmin" />
                      <Shield className="h-5 w-5 text-destructive" />
                      <div className="flex-1">
                        <Label
                          htmlFor="ClubAdmin"
                          className="cursor-pointer font-bold"
                        >
                          CLUB ADMIN
                        </Label>
                        <p className="text-xs text-muted-foreground font-medium">
                          Create and manage epic events for your club
                        </p>
                      </div>
                      <Rocket className="h-4 w-4 text-destructive" />
                    </div>
                  </div>
                </RadioGroup>
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

        <div className="text-center mt-8 p-4 bg-gradient-to-r from-destructive/10 to-blue-500/10 rounded-lg border border-destructive/20">
          <p className="text-xs font-bold uppercase tracking-wide text-destructive mb-2">
            🎉 JOIN THE PARTY
          </p>
          <p className="text-xs text-muted-foreground">
            Free forever • No spam • Instant access to epic events
          </p>
        </div>
      </div>
    </div>
  );
}
