import JWT from "jsonwebtoken";
import createErrors from "http-errors";

export const verifyToken = (req, res, next) => {
  if (!req.headers["authorization"]) return next(createErrors.Unauthorized);
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];

  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) res.status(403).json("Token is not valid!");
    req.user = user;
    next();
  });
};

export const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

export const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};
