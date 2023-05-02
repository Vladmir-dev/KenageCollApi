import { Cart } from "../models/Cart.js";
import createErrors from "http-errors";
import mongoose from "mongoose";

// creating cart
export const createCart = async (req, res, next) => {
  try {
    const newCart = await Cart.create(req.body);
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (error) {
    next(error);
  }
};

// updating cart
export const updateCart = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Cart with this id does not exist");
    const updatedCart = await Cart.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    next(error);
  }
};

// deleting cart
export const deleteCart = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Cart with this id does not exist");
    await Cart.findByIdAndDelete(_id);
    res.status(200).json("Cart has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

// getting cart
export const getAllCarts = async (req, res, next) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (error) {
    next(error);
  }
};

// getting cart
export const getCart = async (req, res, next) => {
  const { userId: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Cart with this id does not exist");
    const cart = await Cart.findOne({ userId: _id });
    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};
