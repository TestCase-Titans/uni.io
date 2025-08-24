import express from "express";
import { requireRole } from "../middleware/roleMiddleware.js";
import {
  banUser,
  approveClubAdmin,
  addSysAdmin,
  deleteEvent,
} from "../controllers/sysAdminController.js";

const router = express.Router();

router.post("/ban/:id", requireRole("sysAdmin"), banUser);
router.post("/approve-club-admin/:applicationId", requireRole("sysAdmin"), approveClubAdmin);
router.post("/add-sysadmin/:userid", requireRole("sysAdmin"), addSysAdmin);
router.delete("/event/:eventId", requireRole("sysAdmin"), deleteEvent);

export default router;
