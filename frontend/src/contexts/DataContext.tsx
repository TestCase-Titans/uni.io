import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import apiClient from "../utils/api";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

// 1. Updated Event interface to match the backend schema
export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string; // Changed from 'date'
  event_time: string; // Changed from 'time'
  location: string;
  category: string;
  capacity: number;
  registered: number; // This will be calculated or fetched
  organizer: string;
  image_url?: string;
  status: "upcoming" | "ongoing" | "completed" | "draft" | "cancelled";
  // Add any other fields from your backend if necessary
}

// Registration interface remains the same
export interface Registration {
  eventId: string;
  userId: string;
  registeredAt: string;
}

interface DataContextType {
  events: Event[];
  userEvents: Event[]; // Events the current user is registered for
  isLoading: boolean;
  fetchEvents: () => void;
  registerForEvent: (eventId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  createEvent: (
    event: Omit<Event, "id" | "registered" | "status">
  ) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  isRegistered: (eventId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Function to fetch all events from the backend
  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Choose the correct endpoint based on user role
      const endpoint = user?.role === "student" ? "/events/browse" : "/events/";
      const response = await apiClient.get<Event[]>(endpoint);

      // A simple fix for date and time properties until the backend is updated
      const formattedEvents = response.data.map((event) => ({
        ...event,
        date: event.event_date,
        time: event.event_time,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Could not load events.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // 3. Function to fetch events the user is registered for
  const fetchUserEvents = useCallback(async () => {
    if (user?.role !== "student") {
      setUserEvents([]);
      return;
    }
    try {
      const response = await apiClient.get<Event[]>(
        "/events/participated/list"
      );
      // A simple fix for date and time properties until the backend is updated
      const formattedEvents = response.data.map((event) => ({
        ...event,
        date: event.event_date,
        time: event.event_time,
      }));
      setUserEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    }
  }, [user]);

  // 4. Fetch initial data when the user is available
  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchUserEvents();
    } else {
      // Clear data on logout
      setEvents([]);
      setUserEvents([]);
      setIsLoading(false);
    }
  }, [user, fetchEvents, fetchUserEvents]);

  // 5. API-driven functions
  const registerForEvent = async (eventId: string) => {
    try {
      await apiClient.post(`/events/${eventId}/register`);
      toast.success("Successfully registered for the event!");
      // Refetch data to update the UI
      fetchEvents();
      fetchUserEvents();
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    try {
      await apiClient.post(`/events/${eventId}/unregister`);
      toast.success("Successfully unregistered from the event.");
      // Refetch data to update the UI
      fetchEvents();
      fetchUserEvents();
    } catch (error: any) {
      console.error("Unregistration failed:", error);
      toast.error(
        error.response?.data?.message ||
          "Unregistration failed. Please try again."
      );
    }
  };

  const createEvent = async (
    eventData: Omit<Event, "id" | "registered" | "status">
  ) => {
    try {
      await apiClient.post("/events/create", eventData);
      toast.success("Event created successfully!");
      fetchEvents(); // Refresh the events list
    } catch (error: any) {
      console.error("Failed to create event:", error);
      toast.error(error.response?.data?.message || "Failed to create event.");
      throw error; // Re-throw to handle in the form
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      await apiClient.put(`/events/${eventId}`, updates);
      toast.success("Event updated successfully!");
      fetchEvents(); // Refresh the events list
    } catch (error: any) {
      console.error("Failed to update event:", error);
      toast.error(error.response?.data?.message || "Failed to update event.");
      throw error; // Re-throw to handle in the form
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully.");
      fetchEvents(); // Refresh the events list
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event.");
    }
  };

  const isRegistered = (eventId: string) => {
    return userEvents.some((event) => event.id === eventId);
  };

  const value = {
    events,
    userEvents,
    isLoading,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    isRegistered,
    // Note: 'registrations' is now handled implicitly via 'userEvents'
    registrations: [],
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
