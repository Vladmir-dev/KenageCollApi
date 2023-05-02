import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../helpers/jwtAccessToken.js";
import {
  createCart,
  deleteCart,
  getAllCarts,
  getCart,
  updateCart,
} from "../controllers/cartController.js";

const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllCarts);
router.get("/find/:userId", verifyTokenAndAuthorization, getCart);
router.post("/", verifyToken, createCart);
router.put("/:id", verifyTokenAndAuthorization, updateCart);
router.patch("/:id", verifyTokenAndAuthorization, updateCart);
router.delete("/:id", verifyTokenAndAuthorization, deleteCart);
export default router;
