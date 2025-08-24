import db from "../config/db.js";

/* ---------------- CLUB ADMIN FEATURES ---------------- */

// Create Event
export const createEvent = (req, res) => {
  const {
    title,
    description,
    event_date,
    event_time,
    duration,
    category,
    address,
    room,
    registration_deadline,
    capacity,
    image_url,
  } = req.body;

  // Use logged-in clubAdmin's name as organizer
  const organizer = req.user.name;

  const query = `
    INSERT INTO clubEvents
      (title, organizer, description, event_date, event_time, duration, category, address, room, registration_deadline, capacity, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      title,
      organizer,
      description,
      event_date,
      event_time,
      duration,
      category,
      address,
      room,
      registration_deadline,
      capacity,
      image_url,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Event created successfully", eventId: result.insertId });
    }
  );
};

// Update Event (only by clubAdmin who created it)
export const updateEvent = (req, res) => {
  const eventId = req.params.id;
  const updates = req.body;
  const organizer = req.user.name;

  const query = "UPDATE clubEvents SET ? WHERE id = ? AND organizer = ?";
  db.query(query, [updates, eventId, organizer], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found or you are not allowed to edit" });
    res.json({ message: "Event updated successfully" });
  });
};

// Delete Event (clubAdmin can delete own events, sysAdmin can delete any)
export const deleteEvent = (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  let query;
  let params;

  if (user.isSysAdmin) {
    // sysAdmin can delete any event
    query = "DELETE FROM clubEvents WHERE id = ?";
    params = [eventId];
  } else {
    // clubAdmin can delete only own events
    const organizer = req.user.name;
    query = "DELETE FROM clubEvents WHERE id = ? AND organizer = ?";
    params = [eventId, organizer];
  }

  db.query(query, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Event not found or not allowed to delete" });
    res.json({ message: "Event deleted successfully" });
  });
};

// List clubAdmin's events + quick stats
export const getMyEvents = (req, res) => {
  const organizer = req.user.name;

  const query = `
    SELECT *,
      (SELECT COUNT(*) FROM event_registrants WHERE event_id = clubEvents.id) AS registeredCount
    FROM clubEvents
    WHERE organizer = ?
  `;

  db.query(query, [organizer], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

/* ---------------- STUDENT FEATURES ---------------- */

// Browse all events (for students)
export const getAllEvents = (req, res) => {
  const query = "SELECT * FROM clubEvents";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Event detail by id
export const getEventById = (req, res) => {
  const eventId = req.params.id;
  const query = "SELECT * FROM clubEvents WHERE id = ?";
  db.query(query, [eventId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Event not found" });
    res.json(result[0]);
  });
};

// Register for event
export const registerForEvent = (req, res) => {
  const user = req.user;
  const userId = user.id;
  const eventId = req.params.id;

  // ClubAdmin cannot register
  if (user.clubAdminStatus === "accepted") {
    return res.status(403).json({ message: "Club admins cannot register for events" });
  }

  const query = "INSERT INTO event_registrants (user_id, event_id) VALUES (?, ?)";
  db.query(query, [userId, eventId], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Already registered" });
      }
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: "Registered successfully" });
  });
};

// Unregister from event
export const unregisterFromEvent = (req, res) => {
  const userId = req.user.id;
  const eventId = req.params.id;

  const query = "DELETE FROM event_registrants WHERE user_id = ? AND event_id = ?";
  db.query(query, [userId, eventId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not registered for this event" });
    res.json({ message: "Unregistered successfully" });
  });
};

// List events student has participated in
export const getParticipatedEvents = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT e.* 
    FROM clubEvents e
    JOIN event_registrants er ON e.id = er.event_id
    WHERE er.user_id = ?
  `;
  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};
