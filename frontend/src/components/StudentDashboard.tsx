import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Separator } from "./ui/separator";
import {
  CalendarDays,
  MapPin,
  Users,
  Settings,
  LogOut,
  Calendar,
  Clock,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";

interface StudentDashboardProps {}

export function StudentDashboard({}: StudentDashboardProps) {
  const navigate = useNavigate();
  const { userEvents, unregisterFromEvent } = useData();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcomingEvents = userEvents.filter(
    (event) => event.status === "upcoming"
  );
  const completedEvents = userEvents.filter(
    (event) => event.status === "completed"
  );

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

  const handleUnregister = (eventId: string, eventTitle: string) => {
    unregisterFromEvent(eventId);
    toast.success(`Unregistered from "${eventTitle}"`);
  };

  const handleLogout = () => {
    logout();
    navigate("home");
  };

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r min-h-screen p-6">
          <div className="space-y-6">
            {/* User Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-destructive rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-destructive-foreground font-semibold text-xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h3 className="font-medium">{user?.name}</h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <Badge variant="secondary" className="mt-2">
                Student
              </Badge>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setActiveTab("upcoming")}
              >
                <Calendar className="h-4 w-4 mr-3" />
                My Events
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("events")}
              >
                <CalendarDays className="h-4 w-4 mr-3" />
                All Events
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("certificates")}
              >
                <Trophy className="h-4 w-4 mr-3" />
                Certificates
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("settings")}
              >
                <Settings className="h-4 w-4 mr-3" />
                Settings
              </Button>
            </nav>

            <Separator />

            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl mb-2">
                Welcome back, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">
                Manage your event registrations and discover new opportunities
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Upcoming Events
                      </p>
                      <p className="text-2xl font-bold">
                        {upcomingEvents.length}
                      </p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Completed
                      </p>
                      <p className="text-2xl font-bold">
                        {completedEvents.length}
                      </p>
                    </div>
                    <Trophy className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Events
                      </p>
                      <p className="text-2xl font-bold">{userEvents.length}</p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="completed">Completed Events</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcomingEvents.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No upcoming events</h3>
                      <p className="text-muted-foreground mb-6">
                        You haven't registered for any upcoming events yet.
                      </p>
                      <Button onClick={() => navigate("events")}>
                        Browse Events
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {upcomingEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUnregister(event.id, event.title)
                              }
                              className="text-xs text-muted-foreground hover:text-destructive"
                            >
                              Unregister
                            </Button>
                          </div>
                          <CardTitle
                            className="line-clamp-2 cursor-pointer hover:text-destructive"
                            onClick={() => navigate(`event-${event.id}`)}
                          >
                            {event.title}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {event.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <CalendarDays className="h-4 w-4 mr-2" />
                              {new Date(
                                event.date
                              ).toLocaleDateString()} at {event.time}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              {event.registered}/{event.capacity} registered
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedEvents.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg mb-2">No completed events</h3>
                      <p className="text-muted-foreground mb-6">
                        Complete some events to see them here and earn
                        certificates.
                      </p>
                      <Button onClick={() => navigate("events")}>
                        Explore Events
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-lg transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between mb-2">
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            <Badge variant="secondary">Completed</Badge>
                          </div>
                          <CardTitle
                            className="line-clamp-2 cursor-pointer hover:text-destructive"
                            onClick={() => navigate(`event-${event.id}`)}
                          >
                            {event.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-muted-foreground">
                              <CalendarDays className="h-4 w-4 mr-2" />
                              {new Date(event.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <MapPin className="h-4 w-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-4"
                            onClick={() => navigate("certificates")}
                          >
                            <Trophy className="h-4 w-4 mr-2" />
                            View Certificate
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
