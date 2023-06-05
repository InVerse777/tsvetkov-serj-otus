import * as UserService from "../services/user.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import * as AppErrors from "../errorHandling/errors.js";
const { SECRET = "secret" } = process.env;

export const renderAuthPage = async function (req, res) {
  res.render("auth", { title: "Login" });
};

export const signup = async function (req, res, next) {
  try {
    // hash the password
    req.body.password = await bcrypt.hash(req.body.password, 10);
    // create a new user
    const user = await UserService.createUser(req.body).catch((err) => {
      throw err;
    });
    // send new user as response
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const login = async function (req, res, next) {
  try {
    // check if the user exists
    const user = await UserService.getUser({
      username: req.body.username,
    }).catch((err) => {
      throw err;
    });

    if (user) {
      //check if password matches
      const result = await bcrypt.compare(req.body.password, user.password);
      if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);
        res
          .status(200)
          .cookie("auth", token, { "maxAge": 999999999, httpOnly: true })
          .end();
      } else {
        throw new AppErrors.Error401("Wrong username or password");
      }
    } else {
      throw new AppErrors.Error401("Wrong username or password");
    }
  } catch (error) {
    next(error);
  }
};
