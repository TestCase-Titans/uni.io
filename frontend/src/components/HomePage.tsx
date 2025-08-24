import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CalendarDays,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Sparkles,
  Rocket,
  Star,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface HomePageProps {}

export function HomePage({}: HomePageProps) {
  const navigate = useNavigate();
  const { events } = useData();
  const { user } = useAuth();

  const upcomingEvents = events
    .filter((event) => event.status === "upcoming")
    .slice(0, 3);

  const getCategoryColor = (category: string) => {
    const colors = {
      Technology:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      Environment:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      Career:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      Arts: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Redis Style */}
      <section className="relative px-4 py-16 sm:py-24 lg:py-32 bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-10 w-32 h-32 bg-destructive/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>

        <div className="relative max-w-7xl mx-auto text-center animate-slide-up">
          {/* Fun announcement badge */}
          <div className="inline-flex items-center space-x-2 bg-destructive/10 text-destructive px-4 py-2 rounded-full text-l font-medium mb-8 animate-bounce-gentle">
            <Sparkles className="h-4 w-4" />
            <span>Your campus events just got better!</span>
            <Sparkles className="h-4 w-4" />
          </div>

          <h1 className="redis-heading-lg bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-6">
            EVERY EVENT
            <br />
            <span className="text-destructive redis-heading-lg">
              EVERY CLUB
            </span>
            <br />
            ONE PLACE
          </h1>

          <p className="redis-subtitle text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            The fastest, most fun way for university clubs to create events and
            students to discover amazing experiences.
            <br />
            <strong className="text-foreground">
              Join thousands of students having incredible campus experiences.
            </strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {!user && (
              <Button
                size="lg"
                className="redis-button bg-destructive hover:bg-destructive/90 text-lg px-8 py-6 animate-pulse-glow"
                onClick={() => navigate(user ? "events" : "signup")}
              >
                <Rocket className="mr-2 h-5 w-5" />
                GET STARTED NOW
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="redis-button text-lg px-8 py-6 border-2"
              onClick={() => navigate("events")}
            >
              <Star className="mr-2 h-5 w-5" />
              DISCOVER EVENTS
            </Button>
          </div>

          {/* Fun stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="redis-heading-md text-destructive mb-2">50+</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                Active Events
              </p>
            </div>
            <div className="text-center">
              <div className="redis-heading-md text-destructive mb-2">1K+</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                Students Engaged
              </p>
            </div>
            <div className="text-center">
              <div className="redis-heading-md text-destructive mb-2">24/7</div>
              <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium">
                Discovery
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Event Highlights */}
      <section className="px-4 py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="redis-heading-lg mb-4">
              HOTTEST EVENTS
              <br />
              <span className="text-destructive">RIGHT NOW</span>
            </h2>
            <p className="redis-subtitle text-lg text-muted-foreground max-w-2xl mx-auto">
              Don't miss out on these amazing events happening on campus
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event, index) => (
              <Card
                key={event.id}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 group border-2 hover:border-destructive/20"
                onClick={() => navigate(`event-${event.id}`)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="relative">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      className={`${getCategoryColor(
                        event.category
                      )} font-bold`}
                    >
                      {event.category.toUpperCase()}
                    </Badge>
                    <div className="text-right text-sm">
                      <div className="flex items-center font-bold">
                        <Users className="h-4 w-4 mr-1" />
                        {event.registered}/{event.capacity}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="redis-heading-sm line-clamp-2 group-hover:text-destructive transition-colors">
                    {event.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-base">
                    {event.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-muted-foreground font-medium">
                      <CalendarDays className="h-4 w-4 mr-2 text-destructive" />
                      {new Date(event.date).toLocaleDateString()} at{" "}
                      {event.time}
                    </div>
                    <div className="flex items-center text-muted-foreground font-medium">
                      <MapPin className="h-4 w-4 mr-2 text-destructive" />
                      {event.location}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-medium">
                        by {event.organizer}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="redis-button text-xs"
                      >
                        VIEW DETAILS →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="redis-button border-2 border-destructive text-destructive hover:bg-destructive hover:text-white"
              onClick={() => navigate("events")}
            >
              <Zap className="mr-2 h-5 w-5" />
              VIEW ALL EVENTS
            </Button>
          </div>
        </div>
      </section>

      {/* Value Propositions - Redis Style */}
      <section className="px-4 py-20 bg-gradient-to-br from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* For Students */}
            <div className="space-y-8 animate-slide-up">
              <div>
                <h3 className="redis-heading-md mb-4">
                  FOR STUDENTS
                  <br />
                  <span className="text-destructive">MAKE MEMORIES</span>
                </h3>
                <p className="redis-subtitle text-lg text-muted-foreground mb-8">
                  Transform your campus experience with events that matter
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <CheckCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">
                      INSTANT DISCOVERY
                    </h4>
                    <p className="text-muted-foreground">
                      Find events that match your vibe with fast search and
                      filters
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Zap className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">ONE-CLICK MAGIC</h4>
                    <p className="text-muted-foreground">
                      Register instantly and manage your entire event calendar
                      in one place
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Shield className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">NEVER MISS OUT</h4>
                    <p className="text-muted-foreground">
                      Smart notifications keep you in the loop about everything
                      that matters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Clubs */}
            <div className="space-y-8 animate-slide-up">
              <div>
                <h3 className="redis-heading-md mb-4">
                  FOR CLUBS
                  <br />
                  <span className="text-destructive">BUILD COMMUNITY</span>
                </h3>
                <p className="redis-subtitle text-lg text-muted-foreground mb-8">
                  Create unforgettable events with tools that actually work
                </p>
              </div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <CheckCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">
                      EFFORTLESS CREATION
                    </h4>
                    <p className="text-muted-foreground">
                      Launch professional events in minutes with our intuitive
                      builder
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Zap className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">
                      REAL-TIME INSIGHTS
                    </h4>
                    <p className="text-muted-foreground">
                      Track engagement and attendance with beautiful, actionable
                      analytics
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Shield className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-2 text-lg">AUTO-PILOT MODE</h4>
                    <p className="text-muted-foreground">
                      Smart capacity management and waiting lists handle
                      themselves
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center mb-4">
                <span className="redis-heading-sm text-xl">Uni.io</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Making campus events epic, one click at a time.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">
                Platform
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate("events")}
                    className="hover:text-destructive transition-colors"
                  >
                    Browse Events
                  </button>
                </li>
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Documentation
                  </button>
                </li>
                <li>
                  <button className="hover:text-destructive transition-colors">
                    API
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">
                Support
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Help Center
                  </button>
                </li>
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Community
                  </button>
                </li>
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button className="hover:text-destructive transition-colors">
                    Terms of Service
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>
              © 2025 Uni.io. All rights reserved.{" "}
              <span className="text-destructive">
                Built for the future of campus events.
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
