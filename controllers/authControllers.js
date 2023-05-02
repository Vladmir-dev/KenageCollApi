import { User } from "../models/User.js";
import CryptoJS from "crypto-js";
import { userLogin, userRegister } from "../helpers/JoiUserSchemaValidator.js";
import JWT from "jsonwebtoken";
import createErrors from "http-errors";
import mongoose from "mongoose";

export const register = async (req, res, next) => {
  try {
    const validUser = await userRegister.validateAsync(req.body);
    const oldUser = await User.findOne({ email: validUser.email });
    if (oldUser) throw createErrors.Conflict(`${oldUser.email} already exists`);
    const encryptedPassword = CryptoJS.AES.encrypt(
      validUser.password,
      process.env.PASSWORD_SECRET
    );

    const newUser = await User.create({
      ...validUser,
      password: encryptedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User was registered successfully!" });
  } catch (error) {
    if (error.isJoi == true) error.status = 422;
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validUser = await userLogin.validateAsync(req.body);
    const user = await User.findOne({ email: validUser.email });
    if (!user) throw createErrors.NotFound("User is not registered");
    const encryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const matchedPassword = encryptedPassword.toString(CryptoJS.enc.Utf8);
    if (matchedPassword !== validUser.password)
      throw createErrors.Unauthorized("Incorrect credentials");

    const accessToken = JWT.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

export const me = async (req, res, next) => {
  const { id: _id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(_id))
      throw createErrors.NotFound("User does not exist");
    const oldUser = await User.findOne({ _id: _id });
    res.status(200).json(oldUser);
  } catch (error) {
    next(error);
  }
};
