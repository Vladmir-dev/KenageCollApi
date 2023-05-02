import { Product } from "../models/Product.js";
import createErrors from "http-errors";
import mongoose from "mongoose";

// creating Product
export const createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create(req.body);
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

// updating Product
export const updateProduct = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Product with this id does not exist");
    const updatedProduct = await Product.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

// deleting Product
export const deleteProduct = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Product with this id does not exist");
    await Product.findByIdAndDelete(_id);
    res.status(200).json("Product has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

// getting all Product
export const getAllProducts = async (req, res, next) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;

    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// getting all user Products
export const getProduct = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Product with this id does not exist");
    const Product = await Product.findById(_id);
    res.status(200).json(Product);
  } catch (error) {
    next(error);
  }
};
