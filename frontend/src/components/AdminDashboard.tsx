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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Separator } from "./ui/separator";
import {
  CalendarDays,
  MapPin,
  Users,
  Settings,
  LogOut,
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";

interface AdminDashboardProps {}

export function AdminDashboard({}: AdminDashboardProps) {
  const navigate = useNavigate();
  const { adminEvents, deleteEvent } = useData();
  const { user, logout } = useAuth();

  // Filter events created by this admin (in a real app, this would be based on user ID)
  //  const adminEvents = events;

  const upcomingEvents = adminEvents.filter(
    (event) => event.status === "upcoming"
  );
  const totalAttendees = adminEvents.reduce(
    (sum, event) => sum + (event.registered || 0),
    0
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

  const getStatusColor = (status: string) => {
    const colors = {
      upcoming:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      ongoing:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      completed:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    );
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (confirm(`Are you sure you want to delete "${eventTitle}"?`)) {
      deleteEvent(eventId);
      toast.success("Event deleted successfully");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
                Admin
              </Badge>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-3" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/events")}
              >
                <CalendarDays className="h-4 w-4 mr-3" />
                All Events
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate("/settings")}
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
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl mb-2">Event Management</h1>
                <p className="text-muted-foreground">
                  Manage your events and track attendance
                </p>
              </div>
              <Button
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => navigate("/create-event")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-4 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Events
                      </p>
                      <p className="text-2xl font-bold">{adminEvents.length}</p>
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
                        Upcoming
                      </p>
                      <p className="text-2xl font-bold">
                        {upcomingEvents.length}
                      </p>
                    </div>
                    <CalendarDays className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Attendees
                      </p>
                      <p className="text-2xl font-bold">{totalAttendees}</p>
                    </div>
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Avg. Attendance
                      </p>
                      <p className="text-2xl font-bold">
                        {adminEvents.length > 0
                          ? Math.round(totalAttendees / adminEvents.length)
                          : 0}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Events Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Events</CardTitle>
                <CardDescription>
                  Manage all your created events from one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                {adminEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No events created yet</h3>
                    <p className="text-muted-foreground mb-6">
                      Create your first event to get started with event
                      management.
                    </p>
                    <Button onClick={() => navigate("/create-event")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Attendees</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {adminEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell className="font-medium max-w-xs">
                              <div className="truncate">{event.title}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>
                                  {new Date(event.date).toLocaleDateString()}
                                </div>
                                <div className="text-muted-foreground">
                                  {event.time}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate text-sm">
                                {event.address}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(event.status)}>
                                {event.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>
                                  {event.registered}/{event.capacity}
                                </div>
                                <div className="text-muted-foreground">
                                  {Math.round(
                                    (event.registered / event.capacity) * 100
                                  )}
                                  %
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getCategoryColor(event.category)}
                              >
                                {event.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate(`/event/${event.id}`)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/edit-event/${event.id}`)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteEvent(event.id, event.title)
                                  }
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
