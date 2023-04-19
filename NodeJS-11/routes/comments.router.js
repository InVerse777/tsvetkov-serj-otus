const express = require("express");
const router = express.Router();
const Courses = require("../models/Courses");
const { isLoggedIn } = require("../controller/auth.middleware");

router.post("/comment/:lesson_id", isLoggedIn, async (req, res) => {
  try {
    const filter = { "lessons._id": req.params.lesson_id };
    const thisCourse = await Courses.findOne(filter);
    const accGrantedIndex = thisCourse.accessGrantedTo.findIndex(
      (x) => x.userName === req.user.username
    );
    const lesIndex = thisCourse.lessons.findIndex(
      (x) => x._id == req.params.lesson_id
    );
    if (lesIndex!=-1 && (req.user.username === thisCourse.courseCreator || accGrantedIndex!=-1)){
      req.body.commentAuthor= req.user.username
      thisCourse.lessons[lesIndex].comments.push(req.body);
      await thisCourse.save();
      res.status(200).json(thisCourse).end();
    }
    else{
      res.status(400).json({"error":"You dont have permission or something wrorn with parameters"})
    }

    //   await Courses.findOneAndUpdate(filter, {$push: {`lessons.${lesIndex}.comments`: req.body}},{upsert:true})
    
  } catch (err) {
    res.status(400).json({ err });
  }
});

router.delete("/comment/:lesson_id/:comment_id", async (req, res) => {
    try {
        const filter = { "lessons._id": req.params.lesson_id };
        const doc = await Courses.findOne(filter);
        const lesIndex = doc.lessons.findIndex(
          (x) => x._id == req.params.lesson_id
        );
        const resIndex = doc.lessons[lesIndex].comments.findIndex((x)=>x.id ==req.params.res_id)
        doc.lessons[lesIndex].comments.splice(resIndex,1)
        await doc.save();
        res.status(200).json(doc).end();
      } catch (err) {
        res.status(400).json({ err });
      }
    });
    router.patch("/comment/:lesson_id/:comment_id", async (req, res) => {
        try {
            const filter = { "lessons._id": req.params.lesson_id };
            const doc = await Courses.findOne(filter);
            const lesIndex = doc.lessons.findIndex(
              (x) => x._id == req.params.lesson_id
            );
            const resIndex = doc.lessons[lesIndex].comments.findIndex((x)=>x.id ==req.params.res_id)
            doc.lessons[lesIndex].comments[resIndex]=req.body
            await doc.save();
            res.status(200).json(doc).end();
          } catch (err) {
            res.status(400).json({ err });
          }
        });

module.exports = router;
