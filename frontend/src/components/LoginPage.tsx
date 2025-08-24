import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "./ui/checkbox";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface LoginPageProps {}

export function LoginPage({}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const result = await login(email, password, rememberMe);

      if (result) {
        if (result.role === "student") {
          navigate("/student-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
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

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <span className="redis-heading-md">Uni.io</span>
          </div>
          <h1 className="redis-heading-md mb-4">
            WELCOME BACK
            <br />
            <span className="text-destructive">SUPERSTAR</span>
          </h1>
          <p className="redis-subtitle text-muted-foreground">
            Ready to dive back into epic campus events?
          </p>
        </div>

        <Card className="border-2 hover:border-destructive/20 transition-colors">
          <CardHeader className="text-center">
            <CardTitle className="redis-heading-sm">SIGN IN</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
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
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="border-2 focus:border-destructive font-medium"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <Label htmlFor="remember" className="text-sm font-medium">
                    Remember me
                  </Label>
                </div>
                <Button
                  variant="link"
                  className="px-0 text-sm font-bold text-destructive hover:text-destructive/80"
                >
                  FORGOT PASSWORD?
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
                    SIGNING IN...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    SIGN IN NOW
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground">
                Don't have an account yet?{" "}
                <Button
                  variant="link"
                  className="px-0 text-destructive font-bold hover:text-destructive/80"
                  onClick={() => navigate("/signup")}
                >
                  CREATE ACCOUNT →
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* <div className="text-center mt-8 p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
            DEMO ACCOUNTS
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Student:</strong> student@test.com | <strong>Admin:</strong>{" "}
            admin@test.com
            <br />
            <strong>Password:</strong> anything works! 🎉
          </p>
        </div> */}
      </div>
    </div>
  );
}
