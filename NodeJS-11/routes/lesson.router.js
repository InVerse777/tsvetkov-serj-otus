const express = require("express");
const router = express.Router();
const Courses = require("../models/Courses");
const { isLoggedIn } = require("../controller/auth.middleware");

router.get("/lesson/:l_id", isLoggedIn, async (req, res) => {
  let thisCourse = await Courses.findOne({ "lessons._id": req.params.l_id });
  const index = thisCourse.accessGrantedTo.findIndex(
    (x) => x.userName === req.user.username
  );
  let userIsCreator = false;
  // console.log(obj)onon
  let lsn = thisCourse.lessons.find((x) => x._id == req.params.l_id);
  //console.log(lsn.lessonFilesNLinks[0].link);
  if (req.user.username === thisCourse.courseCreator || index != -1) {
    if (req.user.username === thisCourse.courseCreator) {
      userIsCreator = true;
    }
    res.render("lesson", {
      title: lsn.lessonTitle,
      cid: thisCourse._id,
      cname: thisCourse.courseTitle,
      lesson: lsn,
      isCreator: userIsCreator,
    });
  } else {
    res.status(300).json("You dont have access");
  }
  //res.status(200).end();
});

router.post("/lesson/:course_id", isLoggedIn, async (req, res) => {
  let filter = { _id: req.params.course_id };
  try {
    let thisCourse = await Courses.findOne(filter);
    if (req.user.username === thisCourse.courseCreator) {
      await Courses.findOneAndUpdate(filter, { $push: { lessons: req.body } });
      res.status(200).json({ status: "ok" });
    } else {
      res
        .status(400)
        .json({ err: "You are not the creator and could not add lessons" });
    }
  } catch (err) {
    res.status(400).json({ err });
  }
});
router.delete("/lesson/:lsn_id", async (req, res) => {
  try {
    const lid = req.params.lsn_id;
    let filter = { "lessons._id": lid };
    await Courses.updateOne(
      filter,
      { $pull: { lessons: { _id: lid } } },
      { safe: true, multi: true }
    );
    res.status(200).json({ status: "ok" });
  } catch (err) {
    res.status(400).json({ err });
  }
});

module.exports = router;
