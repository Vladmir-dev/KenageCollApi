import express from "express";
import { verifyTokenAndAdmin } from "../helpers/jwtAccessToken.js";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../controllers/productController.js";

const router = express.Router();
router.get("/", getAllProducts);
router.get("/find/:id", getProduct);
router.post("/", verifyTokenAndAdmin, createProduct);
router.put("/:id", verifyTokenAndAdmin, updateProduct);
router.patch("/:id", verifyTokenAndAdmin, updateProduct);
router.delete("/:id", verifyTokenAndAdmin, deleteProduct);
export default router;
