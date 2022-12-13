import express, { Request, Response } from "express";
import { UpdateUserProfile } from "../controller/userController";
import requireAuth from "../Authentication/Auth";
const router = express.Router();

router.put("updateUserProfile/:id ", requireAuth, UpdateUserProfile);

export default router;
