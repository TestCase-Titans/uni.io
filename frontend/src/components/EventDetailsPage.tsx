import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  CalendarDays,
  MapPin,
  Users,
  Share2,
  Download,
  ArrowLeft,
  Clock,
  User,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

interface EventDetailsPageProps {}

export function EventDetailsPage({}: EventDetailsPageProps) {
  const navigate = useNavigate();
  const {
    events,
    registerForEvent,
    unregisterFromEvent,
    isRegistered,
    isLoading,
  } = useData();
  const { user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const { eventId } = useParams<{ eventId: string }>();
  const event = events.find((e) => e.id == eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Event not found</h1>
          <Button onClick={() => navigate("/events")}>Back to Events</Button>
        </div>
      </div>
    );
  }

  const isUserRegistered = isRegistered(event.id);
  const isFull = event.registered >= event.capacity;
  const canRegister =
    user && !isUserRegistered && !isFull && event.status === "upcoming";
  const canUnregister = user && isUserRegistered && event.status === "upcoming";

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

  const handleRegister = () => {
    if (!user) {
      toast.error("Please sign in to register for events");
      navigate("/login");
      return;
    }

    registerForEvent(event.id);
    toast.success("Successfully registered for the event!");
  };

  const handleUnregister = () => {
    unregisterFromEvent(event.id);
    toast.success("Successfully unregistered from the event");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Event link copied to clipboard!");
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(`${event.date}T${event.time}`);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

    const formatDate = (date: Date) =>
      date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&dates=${formatDate(startDate)}/${formatDate(
      endDate
    )}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(event.address)}`;

    window.open(calendarUrl, "_blank");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/events")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge className={getCategoryColor(event.category)}>
                {event.category}
              </Badge>
              <Badge className={getStatusColor(event.status)}>
                {event.status}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm" onClick={handleAddToCalendar}>
                <Download className="h-4 w-4 mr-2" />
                Add to Calendar
              </Button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl mb-4">{event.title}</h1>

          <div className="flex items-center text-muted-foreground mb-6">
            <User className="h-4 w-4 mr-2" />
            Organized by{" "}
            <span className="font-medium ml-1">{event.organizer}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Details */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CalendarDays className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        at {event.time} until {event.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{event.address}</p>
                      <p className="text-sm text-muted-foreground">
                        Event location
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {event.registered} / {event.capacity} registered
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.capacity - event.registered} spots remaining
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>
                  {isUserRegistered
                    ? "You're registered for this event"
                    : isFull
                    ? "This event is full"
                    : "Register to secure your spot"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!user ? (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Sign in to register for this event
                    </p>
                    <div className="space-y-2">
                      <Button
                        className="w-full bg-destructive hover:bg-destructive/90"
                        onClick={() => navigate("/login")}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/signup")}
                      >
                        Create Account
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {canRegister && (
                      <Button
                        className="w-full bg-destructive hover:bg-destructive/90"
                        onClick={handleRegister}
                      >
                        Register Now
                      </Button>
                    )}

                    {canUnregister && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleUnregister}
                      >
                        Unregister
                      </Button>
                    )}

                    {isUserRegistered && event.status !== "upcoming" && (
                      <div className="text-center">
                        <Badge variant="secondary">Registered</Badge>
                      </div>
                    )}

                    {isFull && !isUserRegistered && (
                      <Button variant="outline" className="w-full" disabled>
                        Event Full
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Registered
                    </span>
                    <span className="font-medium">{event.registered}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Capacity
                    </span>
                    <span className="font-medium">{event.capacity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Available
                    </span>
                    <span className="font-medium">
                      {event.capacity - event.registered}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Category
                    </span>
                    <Badge className={getCategoryColor(event.category)}>
                      {event.category}
                    </Badge>
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
