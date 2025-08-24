import express from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getMyEvents,
  getAllEvents,
  registerForEvent,
  unregisterFromEvent,
  getParticipatedEvents,
  getEventById,
} from "../controllers/eventController.js";

const router = express.Router();

/* ---------------- CLUB ADMIN ---------------- */
// Create event
router.post(
  "/create",
  isAuthenticated,
  requireRole("clubAdmin"),
  createEvent
);

// Update event (only their own events)
router.put(
  "/:id",
  isAuthenticated,
  requireRole("clubAdmin"),
  updateEvent
);

// Delete event (clubAdmin owns it or sysAdmin can delete any)
router.delete(
  "/:id",
  isAuthenticated,
  requireRole(["clubAdmin", "sysAdmin"]),
  deleteEvent
);

// List clubAdmin’s own events
router.get(
  "/my-events",
  isAuthenticated,
  requireRole("clubAdmin"),
  getMyEvents
);

// List all events (clubAdmin can view all)
router.get(
  "/",
  isAuthenticated,
  requireRole("clubAdmin"),
  getAllEvents
);

/* ---------------- STUDENT ---------------- */
// Browse all events
router.get(
  "/browse",
  isAuthenticated,
  requireRole("student"),
  getAllEvents
);

// Event details
router.get("/:id", isAuthenticated, getEventById);

// Register for an event
router.post(
  "/:id/register",
  isAuthenticated,
  requireRole("student"),
  registerForEvent
);

// Unregister from an event
router.post(
  "/:id/unregister",
  isAuthenticated,
  requireRole("student"),
  unregisterFromEvent
);

// List participated events
router.get(
  "/participated/list",
  isAuthenticated,
  requireRole("student"),
  getParticipatedEvents
);

export default router;
