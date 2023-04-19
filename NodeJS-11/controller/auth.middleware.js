require("dotenv").config(); // loading env variables
const jwt = require("jsonwebtoken");

const isLoggedIn = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth != "undefined") {
      const token = req.cookies.auth; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          console.log(req.user.username);
          next();
        } else {
          res.status(400).json({ error: "token verification failed" });
        }
      } else {
        res.status(400).json({ error: "malformed auth header" });
      }
    } else {
      //res.status(400).json({ "error": "No authorization cookie" });
      res.redirect("../user/auth");
    }
  } catch (error) {
    res.status(400).json({ error1: error });
  }
};

const getUser = async (req, res, next) => {
  try {
    if (typeof req.cookies.auth != "undefined") {
      const token = req.cookies.auth; //split the header and get the token
      if (token) {
        const payload = await jwt.verify(token, process.env.SECRET);
        if (payload) {
          // store user data in request object
          req.user = payload;
          next();
        }
      } else {
        next();
      }
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

// MIDDLEWARE FOR AUTHORIZATION (MAKING SURE THEY ARE LOGGED IN)
// const isLoggedIn = async (req, res, next) => {
//   try {
//     // check if auth header exists
//     if (req.headers.authorization) {
//       // parse token from header
//       const token = req.headers.authorization.split(" ")[1]; //split the header and get the token
//       if (token) {
//         const payload = await jwt.verify(token, process.env.SECRET);
//         if (payload) {
//           // store user data in request object
//           req.user = payload;
//           next();
//         } else {
//           res.status(400).json({ error: "token verification failed" });
//         }
//       } else {
//         res.status(400).json({ error: "malformed auth header" });
//       }
//     } else {
//       res.status(400).json({ error: "No authorization header" });
//     }
//   } catch (error) {
//     res.status(400).json({ error });
//   }
// };

// export custom middleware
module.exports = {
  isLoggedIn,
  getUser,
};
