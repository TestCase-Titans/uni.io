import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ArrowLeft,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Type,
  Clock,
  Image as ImageIcon,
} from "lucide-react";
import { useData } from "../contexts/DataContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";

export function EventFormPage() {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { events, createEvent, updateEvent } = useData();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!eventId;
  const existingEvent = isEditing ? events.find((e) => e.id == eventId) : null;

  // State now includes all required fields from the backend
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    duration: "", // in minutes
    address: "",
    category: "",
    capacity: "",
    registration_deadline: "",
    image_url: "",
    organizer: user?.name || "Your Club",
  });

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description,
        event_date: new Date(existingEvent.event_date)
          .toISOString()
          .split("T")[0],
        event_time: existingEvent.event_time,
        duration: existingEvent.duration?.toString() || "",
        address: existingEvent.address,
        category: existingEvent.category,
        capacity: existingEvent.capacity.toString(),
        registration_deadline: new Date(existingEvent.registration_deadline)
          .toISOString()
          .slice(0, 16),
        image_url: existingEvent.image_url || "",
        organizer: existingEvent.organizer,
      });
    }
  }, [existingEvent]);

  const categories = [
    "technology",
    "film and photography",
    "environment",
    "debate",
    "career",
    "sports",
    "esports",
    "business",
    "health",
    "cultural",
    "other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simple validation for all fields
    for (const key in formData) {
      if (formData[key as keyof typeof formData] === "") {
        setError(
          `Please fill in all required fields. Missing: ${key.replace(
            "_",
            " "
          )}`
        );
        setIsLoading(false);
        return;
      }
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1) {
      setError("Capacity must be a positive number");
      setIsLoading(false);
      return;
    }

    const duration = parseInt(formData.duration);
    if (isNaN(duration) || duration < 1) {
      setError("Duration must be a positive number");
      setIsLoading(false);
      return;
    }

    const eventDate = new Date(`${formData.event_date}T${formData.event_time}`);
    if (!isEditing && eventDate <= new Date()) {
      setError("Event date must be in the future");
      setIsLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        capacity,
        duration,
      };

      if (isEditing && eventId) {
        await updateEvent(eventId, eventData);
        toast.success("Event updated successfully!");
      } else {
        await createEvent(eventData);
        toast.success("Event created successfully!");
      }

      navigate("/admin-dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/admin-dashboard")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl mb-2">
            {isEditing ? "Edit Event" : "Create New Event"}
          </h1>
          <p className="text-muted-foreground">
            {isEditing
              ? "Update your event details and publish changes"
              : "Fill in the details to create and publish your event"}
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>{isEditing ? "Event Details" : "New Event"}</CardTitle>
            <CardDescription>
              {isEditing
                ? "Make changes to your event information"
                : "Provide the essential information for your event"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Event Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  <Type className="h-4 w-4 inline mr-2" />
                  Event Title *
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a compelling event title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Date and Time */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event_date">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date *
                  </Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) =>
                      handleInputChange("event_date", e.target.value)
                    }
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_time">Time *</Label>
                  <Input
                    id="event_time"
                    type="time"
                    value={formData.event_time}
                    onChange={(e) =>
                      handleInputChange("event_time", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Duration (in minutes) *
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  placeholder="e.g., 120 for 2 hours"
                  value={formData.duration}
                  onChange={(e) =>
                    handleInputChange("duration", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Address *
                </Label>
                <Input
                  id="address"
                  placeholder="e.g., University Auditorium, Dhaka"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Category and Capacity */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleInputChange("category", value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">
                    <Users className="h-4 w-4 inline mr-2" />
                    Capacity *
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    placeholder="Maximum attendees"
                    value={formData.capacity}
                    onChange={(e) =>
                      handleInputChange("capacity", e.target.value)
                    }
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Registration Deadline */}
              <div className="space-y-2">
                <Label htmlFor="registration_deadline">
                  Registration Deadline *
                </Label>
                <Input
                  id="registration_deadline"
                  type="datetime-local"
                  value={formData.registration_deadline}
                  onChange={(e) =>
                    handleInputChange("registration_deadline", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url">
                  <ImageIcon className="h-4 w-4 inline mr-2" />
                  Image URL *
                </Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/your-event-image.png"
                  value={formData.image_url}
                  onChange={(e) =>
                    handleInputChange("image_url", e.target.value)
                  }
                  disabled={isLoading}
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="submit"
                  className="bg-destructive hover:bg-destructive/90 flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditing ? "Update Event" : "Create & Publish Event"}</>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin-dashboard")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                * Required fields. Your event will be published immediately.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
