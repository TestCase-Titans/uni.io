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

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  duration: number;
  address: string;
  room?: string;
  category: string;
  capacity: number;
  registered: number;
  organizer: string;
  image_url?: string;
  status: "upcoming" | "ongoing" | "completed" | "draft" | "cancelled";
  registration_deadline: string;
  endTime: string;
}

interface DataContextType {
  events: Event[];
  adminEvents: Event[];
  userEvents: Event[];
  isLoading: boolean;
  fetchEvents: () => void;
  registerForEvent: (eventId: string) => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  createEvent: (
    event: Omit<Event, "id" | "registered" | "status" | "endTime">
  ) => Promise<void>;
  updateEvent: (eventId: string, updates: Partial<Event>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  isRegistered: (eventId: string) => boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [adminEvents, setAdminEvents] = useState<Event[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) return; // Don't fetch if no user
    setIsLoading(true);
    try {
      const endpoint = user.role === "student" ? "/events/browse" : "/events/";
      const response = await apiClient.get<Event[]>(endpoint);
      setEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast.error("Could not load events.");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const fetchAdminEvents = useCallback(async () => {
    if (user?.role !== "clubAdmin" && user?.role !== "sysAdmin") {
      setAdminEvents([]);
      return;
    }
    try {
      const response = await apiClient.get<Event[]>("/events/my-events");
      setAdminEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch admin events:", error);
    }
  }, [user]);

  const fetchUserEvents = useCallback(async () => {
    if (user?.role !== "student") {
      setUserEvents([]);
      return;
    }
    try {
      const response = await apiClient.get<Event[]>(
        "/events/participated/list"
      );
      setUserEvents(response.data);
    } catch (error) {
      console.error("Failed to fetch user events:", error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchEvents();
      fetchUserEvents();
      fetchAdminEvents();
    } else {
      setEvents([]);
      setUserEvents([]);
      setAdminEvents([]);
      setIsLoading(false);
    }
  }, [user, fetchEvents, fetchUserEvents, fetchAdminEvents]);

  const registerForEvent = async (eventId: string) => {
    try {
      await apiClient.post(`/events/${eventId}/register`);
      toast.success("Successfully registered for the event!");
      await Promise.all([fetchEvents(), fetchUserEvents(), fetchAdminEvents()]);
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(error.response?.data?.message || "Registration failed.");
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    try {
      await apiClient.post(`/events/${eventId}/unregister`);
      toast.success("Successfully unregistered from the event.");
      await Promise.all([fetchEvents(), fetchUserEvents(), fetchAdminEvents()]);
    } catch (error: any) {
      console.error("Unregistration failed:", error);
      toast.error(error.response?.data?.message || "Unregistration failed.");
    }
  };

  const createEvent = async (
    eventData: Omit<Event, "id" | "registered" | "status" | "endTime">
  ) => {
    try {
      await apiClient.post("/events/create", eventData);
      toast.success("Event created successfully!");
      // --- FIX: Refresh both event lists ---
      await Promise.all([fetchEvents(), fetchAdminEvents()]);
    } catch (error: any) {
      console.error("Failed to create event:", error);
      toast.error(error.response?.data?.message || "Failed to create event.");
      throw error;
    }
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    try {
      await apiClient.put(`/events/${eventId}`, updates);
      toast.success("Event updated successfully!");
      // --- FIX: Refresh both event lists ---
      await Promise.all([fetchEvents(), fetchAdminEvents()]);
    } catch (error: any) {
      console.error("Failed to update event:", error);
      toast.error(error.response?.data?.message || "Failed to update event.");
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await apiClient.delete(`/events/${eventId}`);
      toast.success("Event deleted successfully.");
      // --- FIX: Refresh both event lists ---
      await Promise.all([fetchEvents(), fetchAdminEvents()]);
    } catch (error: any) {
      console.error("Failed to delete event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event.");
    }
  };

  const isRegistered = (eventId: string) => {
    return userEvents.some(
      (event) => event.id.toString() === eventId.toString()
    );
  };

  const value = {
    events,
    adminEvents,
    userEvents,
    isLoading,
    fetchEvents,
    registerForEvent,
    unregisterFromEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    isRegistered,
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
