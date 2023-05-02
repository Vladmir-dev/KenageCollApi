import { Order } from "../models/Order.js";
import createErrors from "http-errors";
import mongoose from "mongoose";

// creating Order
export const createOrder = async (req, res, next) => {
  try {
    const newOrder = await Order.create(req.body);
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (error) {
    next(error);
  }
};

// updating Order
export const updateOrder = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Order with this id does not exist");
    const updatedOrder = await Order.findByIdAndUpdate(
      _id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (error) {
    next(error);
  }
};

// deleting Order
export const deleteOrder = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Order with this id does not exist");
    await Order.findByIdAndDelete(_id);
    res.status(200).json("Order has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

// getting all Order
export const getAllOrders = async (req, res, next) => {
  try {
    const Orders = await Order.find();
    res.status(200).json(Orders);
  } catch (error) {
    next(error);
  }
};

// getting all user orders
export const getUserOrders = async (req, res, next) => {
  const { userId: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("Order with this id does not exist");
    const Orders = await Order.find({ userId: _id });
    res.status(200).json(Orders);
  } catch (error) {
    next(error);
  }
};

// getting monthly income
export const getOrderMonthlyIncome = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (error) {
    next(error);
  }
};
