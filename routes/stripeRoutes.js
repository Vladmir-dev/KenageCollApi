import express from "express";
import { payment } from "../controllers/stripeController.js";

const router = express.Router();
router.post("/payment", payment);
export default router;
