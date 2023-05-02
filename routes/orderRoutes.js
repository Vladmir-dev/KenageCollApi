import express from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "../helpers/jwtAccessToken.js";

import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderMonthlyIncome,
  getUserOrders,
  updateOrder,
} from "../controllers/orderController.js";

const router = express.Router();
router.get("/", verifyTokenAndAdmin, getAllOrders);
router.get("/income", verifyTokenAndAdmin, getOrderMonthlyIncome);
router.get("/find/:userId", verifyTokenAndAuthorization, getUserOrders);
router.post("/", verifyToken, createOrder);
router.put("/:id", verifyTokenAndAdmin, updateOrder);
router.patch("/:id", verifyTokenAndAdmin, updateOrder);
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);
export default router;
