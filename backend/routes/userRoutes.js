import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = Router();
// add auth later..

router.get("/", getAllUsers);

export default router;
