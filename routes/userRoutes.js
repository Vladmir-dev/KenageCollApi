import express from "express";
import {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} from "../helpers/jwtAccessToken.js";

import {
  deleteUser,
  getAllUsers,
  getUser,
  getUserStats,
  updateUser,
} from "../controllers/userController.js";

const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllUsers);
router.get("/find/:id", verifyTokenAndAdmin, getUser);
router.get("/stats", verifyTokenAndAdmin, getUserStats);
router.put("/:id", verifyTokenAndAuthorization, updateUser);
router.patch("/:id", verifyTokenAndAuthorization, updateUser);
router.delete("/:id", verifyTokenAndAuthorization, deleteUser);
export default router;
