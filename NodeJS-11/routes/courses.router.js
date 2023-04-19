const express = require("express");
const router = express.Router();
const Courses= require("../models/Courses")
const { getUser } = require("../controller/auth.middleware");
router.get("/", (req, res) => {
  res.render("courses", { title: "WebCourseware. Courses" });
});
 

router.get("/courses", getUser, async (req, res) => {
  try{
    const coursesList = await Courses.find({})
   // res.json(coursesList)
  const userStr = req.user? req.user.username: "Anonymous user"
  console.log(userStr)
  res.render("courses", { title: "WebCourseware. Courses", courses: coursesList, user: userStr});
} catch(error){
  res.status(400).json({error});
}
  //res.status(200).end();
});



module.exports = router;
