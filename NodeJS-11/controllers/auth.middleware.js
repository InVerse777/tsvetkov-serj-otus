import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth !== "undefined") {
      const token = req.cookies.auth; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      res.redirect("../user/auth");
    }
  } catch (error) {
    res.status(400).json({ error1: error });
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth != "undefined") {
      const token = req.cookies.auth; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          req.user = payload;
          next();
        } else next();
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
