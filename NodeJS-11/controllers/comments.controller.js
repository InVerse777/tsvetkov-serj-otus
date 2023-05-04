import * as CommentsService from "../services/comments.service.js";
import * as AppErrors from "../errorHandling/errors.js";

export const patchComment = async function (req, res, next) {
  try {
    const doc = await CommentsService.getCourseByLessonId(
      req.params.lessonId
    ).catch((err) => {
      throw err;
    });
    const lesIndex = doc.lessons.findIndex(
      (x) => x._id.toString() === req.params.lessonId
    );
    const resIndex = doc.lessons[lesIndex].comments.findIndex(
      (x) => x.id == req.params.resId
    );
    doc.lessons[lesIndex].comments[resIndex] = req.body;
    await CommentsService.saveCourse(doc).catch((err) => {
      throw err;
    });
    res.status(200).json(doc).end();
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async function (req, res, next) {
  try {
    const doc = await CommentsService.getCourseByLessonId(req.params.lessonId);
    const lesIndex = doc.lessons.findIndex(
      (x) => x._id.toString() === req.params.lessonId
    );
    const resIndex = doc.lessons[lesIndex].comments.findIndex(
      (x) => x.id == req.params.resId
    );
    doc.lessons[lesIndex].comments.splice(resIndex, 1);
    await CommentsService.saveCourse(doc);
    res.status(200).json(doc).end();
  } catch (error) {
    next(error);
  }
};
export const addComment = async function (req, res, next) {
  try {
    const lid = req.params.lessonId;
    const thisCourse = await CommentsService.getCourseByLessonId(lid);
    const accGrantedIndex = thisCourse.accessGrantedTo.findIndex(
      (x) => x.userName === req.user.username
    );
    const lesIndex = thisCourse.lessons.findIndex(
      (x) => x._id.toString() === req.params.lessonId
    );
    if (
      lesIndex != -1 &&
      (req.user.username === thisCourse.courseCreator || accGrantedIndex != -1)
    ) {
      req.body.commentAuthor = req.user.username;
      thisCourse.lessons[lesIndex].comments.push(req.body);
      await CommentsService.saveCourse(thisCourse);
      res.status(200).json(thisCourse).end();
    } else {
      throw new AppErrors.Error400(
        "You dont have permission or something wrong with parameters"
      );
    }
  } catch (error) {
    next(error);
  }
};
