const express = require("express");
const router = express.Router();
const Courses = require("../models/Courses");
const { isLoggedIn } = require("../controller/auth.middleware");

router.post("/resource/:lesson_id", isLoggedIn, async (req, res) => {
  try {
    const filter = { "lessons._id": req.params.lesson_id };
    const doc = await Courses.findOne(filter);
    const lesIndex = doc.lessons.findIndex(
      (x) => x._id == req.params.lesson_id
    );
    console.log(lesIndex);
    //   await Courses.findOneAndUpdate(filter, {$push: {`lessons.${lesIndex}.comments`: req.body}},{upsert:true})
    doc.lessons[lesIndex].lessonFilesNLinks.push(req.body);
    await doc.save();
    res.status(200).json(doc).end();
  } catch (err) {
    res.status(400).json({ err });
  }
});
router.patch("/resource/:lesson_id/:res_id", async (req, res) => {
    try {
      const filter = { "lessons._id": req.params.lesson_id };
      const thisCourse = await Courses.findOne(filter);
      const lesIndex = thisCourse.lessons.findIndex(
        (x) => x._id == req.params.lesson_id
      );
      if (lesIndex!=-1 && req.user.username === thisCourse.courseCreator){
      const resIndex = thisCourse.lessons[lesIndex].lessonFilesNLinks.findIndex((x)=>x.id ==req.params.res_id)
      thisCourse.lessons[lesIndex].lessonFilesNLinks[resIndex]=req.body
      await thisCourse.save();
      res.status(200).json(thisCourse).end();}
      else {
        res.status(401).json({"err":"You are not the creator"})
      }
    } catch (err) {
      res.status(400).json({ err });
    }
  });
router.delete("/resource/:lesson_id/:res_id", async (req, res) => {
    try {
      const filter = { "lessons._id": req.params.lesson_id };
      const doc = await Courses.findOne(filter);
      const lesIndex = doc.lessons.findIndex(
        (x) => x._id == req.params.lesson_id
      );
      if (lesIndex!=-1 && req.user.username === thisCourse.courseCreator){
        const resIndex = doc.lessons[lesIndex].lessonFilesNLinks.findIndex((x)=>x.id ==req.params.res_id)
        if (resIndex!=-1){
          doc.lessons[lesIndex].lessonFilesNLinks.splice(resIndex,1)
          await doc.save();
          res.status(200).json(doc).end();}
          else{
            res.status(400).json({'err':'No such resource'})
          }
        
        }
        else {
          res.status(400).json({'err':'No such lesson'});
        }
    } catch (err) {
      res.status(400).json({ err });
    }
  });

// router.delete("/lesson/:lsn_id", async (req, res) => {
//   try {
//     const lid = req.params.lsn_id;
//     let filter = { "lessons._id": lid };
//     await Courses.findOneAndUpdate(
//       filter,
//       { $pull: { lessons: { _id: lid } } },
//       { safe: true, multi: true }
//     );
//     res.status(200).json({ status: "ok" });
//   } catch (err) {
//     res.status(400).json({ err });
//   }})
module.exports = router;