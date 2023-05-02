import { User } from "../models/User.js";
import createErrors from "http-errors";
import mongoose from "mongoose";

// creating User
export const createUser = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

// updating User
export const updateUser = async (req, res, next) => {
  const { id: _id } = req.params;
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("User with this id does not exist");
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// deleting User
export const deleteUser = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("User with this id does not exist");
    await User.findByIdAndDelete(_id);
    res.status(200).json("User has been deleted successfully");
  } catch (error) {
    next(error);
  }
};

// getting all User
export const getAllUsers = async (req, res, next) => {
  const { new: query } = req.query;
  try {
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// getting all user Users
export const getUser = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("User with this id does not exist");
    const User = await User.findById(_id);
    res.status(200).json(User);
  } catch (error) {
    next(error);
  }
};

// getting all user stats
export const getUserStats = async (req, res, next) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
