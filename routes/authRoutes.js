import express from "express";
import { login, me, register } from "../controllers/authControllers.js";
import { verifyToken } from "../helpers/jwtAccessToken.js";

const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, me);

export default router;
