import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import createErrors from "http-errors";
dotenv.config();

import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(express.json({ extended: true, limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(cors());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", stripeRoutes);

app.use(async (req, res, next) => {
  next(createErrors.NotFound("This route does not exist"));
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error,
    status: error.status || 500,
  });
});

const PORT = process.env.PORT || 7000;

mongoose
  .connect(process.env.MONGO_URL, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(PORT, () =>
      console.log(
        `Server running on port ${PORT}.... \n Starting development server at http://localhost:${PORT} \n Quit the server with CONTROL-C`
      )
    )
  )
  .catch((error) => {
    console.log("Server failed to run successfully");
    console.log(error.message);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to db");
});

mongoose.connection.on("error", (error) => {
  console.log(error.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("Mongoose  is disconnected");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
