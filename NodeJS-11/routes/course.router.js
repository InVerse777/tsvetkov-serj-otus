const express = require("express");
const router = express.Router();
const Courses = require("../models/Courses");
const User = require("../models/User");
const { isLoggedIn } = require("../controller/auth.middleware");

router.get("/course/:id", isLoggedIn, async (req, res) => {
  const thisCourse = await Courses.findOne({ _id: req.params.id });
  const index = thisCourse.accessGrantedTo.findIndex(
    (x) => x.userName === req.user.username
  );
  console.log(JSON.stringify(thisCourse.accessGrantedTo))
  console.log(`Body userName is ${req.body.userName}`)
  console.log(`INDEX is ${index}`)
  let userIsCreator = false;
  if (
    req.user.username === thisCourse.courseCreator ||
    index!=-1
  ) {
    if (req.user.username === thisCourse.courseCreator) {
      userIsCreator = true;
    }
    res.render("course", {
      title: thisCourse.courseTitle,
      course: thisCourse,
      isCreator: userIsCreator,
    });
  } else {
    res.status(300).json("You dont have access");
  }
  //res.status(200).end();
});

router.post("/course", isLoggedIn, async (req, res) => {
  //add validation
  try {
    console.log(req.body);
    req.body.courseCreator = req.user.username;
    console.log(req.body);
    const course = await Courses.create(req.body);
    res.json({ id: course._id });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.patch("/course/:course_id", isLoggedIn, async (req, res) => {
  try {
    const cid = req.params.course_id;
    let filter = { _id: cid };
    const doc = await Courses.findOne(filter);
    if (req.user.username === doc.courseCreator) {
      await Courses.updateOne(filter, req.body);
    } else {
      res.status(401).json("You dont have access");
    }
    //const doc = await Courses.findOneAndUpdate(filter, req.body);
    res.json({ status: "ok" });
  } catch (error) {
    res.status(400).json({ error });
  }
});
router.delete("/course/:course_id", async (req, res) => {
  try {
    const cid = req.params.course_id;
    let filter = { _id: cid };
    const doc = await Courses.findOne(filter);
    if (req.user.username === doc.courseCreator) {
      await Courses.deleteOne(filter);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(401).json("You dont have access");
    }
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/course/access/:course_id", isLoggedIn, async (req, res) => {
  try {
    let doc = await Courses.findOne({ _id: req.params.course_id });
    if (
      (await User.exists({ username: req.body.userName })) &&
      !(req.body.userName in doc.accessGrantedTo) &&
      req.user.username === doc.courseCreator
    ) {
      doc.accessGrantedTo.push(req.body);
      await doc.save();
      res.status(200).json({ status: "ok" });
    } else {
      res.status(401);j
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.delete("/course/access/:course_id", isLoggedIn, async (req, res) => {
  console.log(req.params.course_id);
  try {
    const filter = { _id: req.params.course_id };
    let doc = await Courses.findOne(filter);
    const index = doc.accessGrantedTo.findIndex(
      (x) => x.userName === req.body.userName
    );
    if (index != -1 && req.user.username === doc.courseCreator) {
      doc.accessGrantedTo.splice(index, 1);
      await doc.save();
      res.status(200).json({ status: "ok" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
