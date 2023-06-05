import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import * as AppErrors from "../errorHandling/errors.js";


export const isLoggedIn = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth != "undefined") {
      const token = req.cookies.auth; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          console.log(req.user.username)
          next();
        } else {
          throw new AppErrors.Error400("token verification failed");
next()
        }
      } else {
        throw new AppErrors.Error400("malformed auth header");
        next()
      }
    } else {
      throw new AppErrors.Error403("You have to login to view this page");
      next();
      //res.redirect("../user/auth");
    }
  } catch (error) {
    res.status(400).json(`Error: ${error}`)
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth !== "undefined") {
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
