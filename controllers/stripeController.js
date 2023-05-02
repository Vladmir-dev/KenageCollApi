import express from "express";
import stripe from "stripe";

// payment
export const payment = async (req, res, next) => {
  try {
    stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: "usd",
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          res.status(500).json(stripeErr);
          next(stripeErr);
        } else {
          res.status(200).json(stripeRes);
          next(stripeRes);
        }
      }
    );
  } catch (error) {
    next(error);
  }
};
