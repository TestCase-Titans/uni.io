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
} from "lucide-react";
import { useData, type Event } from "../contexts/DataContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router-dom";

interface EventFormPageProps {
  eventId?: string;
}

export function EventFormPage({ eventId }: EventFormPageProps) {
  const navigate = useNavigate();
  const { events, createEvent, updateEvent } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!eventId;
  const existingEvent = isEditing ? events.find((e) => e.id === eventId) : null;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    capacity: "",
    organizer: "Your Club", // In real app, this would be from user context
  });

  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description,
        date: existingEvent.date,
        time: existingEvent.time,
        location: existingEvent.location,
        category: existingEvent.category,
        capacity: existingEvent.capacity.toString(),
        organizer: existingEvent.organizer,
      });
    }
  }, [existingEvent]);

  const categories = [
    "Technology",
    "Environment",
    "Career",
    "Arts",
    "Sports",
    "Academic",
    "Social",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (
      !formData.title ||
      !formData.description ||
      !formData.date ||
      !formData.time ||
      !formData.location ||
      !formData.category ||
      !formData.capacity
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    const capacity = parseInt(formData.capacity);
    if (isNaN(capacity) || capacity < 1) {
      setError("Capacity must be a positive number");
      setIsLoading(false);
      return;
    }

    // Check if date is in the future
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    if (!isEditing && eventDate <= new Date()) {
      setError("Event date must be in the future");
      setIsLoading(false);
      return;
    }

    try {
      const eventData = {
        ...formData,
        capacity,
        status: "upcoming" as const,
      };

      if (isEditing && eventId) {
        updateEvent(eventId, eventData);
        toast.success("Event updated successfully!");
      } else {
        createEvent(eventData);
        toast.success("Event created successfully!");
      }

      navigate("/admin-dashboard");
    } catch (err) {
      setError("An error occurred. Please try again.");
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
                  placeholder="Describe your event in detail. What will attendees learn or experience?"
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
                  <Label htmlFor="date">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    disabled={isLoading}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  <MapPin className="h-4 w-4 inline mr-2" />
                  Location *
                </Label>
                <Input
                  id="location"
                  placeholder="Where will the event take place?"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
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
                          {category}
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

              {/* Organizer */}
              <div className="space-y-2">
                <Label htmlFor="organizer">Organizer</Label>
                <Input
                  id="organizer"
                  placeholder="Club or organization name"
                  value={formData.organizer}
                  onChange={(e) =>
                    handleInputChange("organizer", e.target.value)
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
                * Required fields. Your event will be published immediately and
                visible to all students.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
