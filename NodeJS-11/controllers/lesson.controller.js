import * as LessonService from "../services/lesson.service.js";
import * as AccessController from "../controllers/access.controller.js";
import * as AppErrors from "../errorHandling/errors.js";
export const renderLessonPage = async function (req, res, next) {
  try {
    let thisCourse = await LessonService.getCourseByLessonId(
      req.params.lId
    ).catch((err) => {
      throw err;
    });
    let lsn = thisCourse.lessons.find(
      (x) => x._id.toString() === req.params.lId
    );
    if (
      AccessController.userHasAccess(thisCourse, req.user.username) &&
      typeof lsn !== "undefined"
    ) {
      res.render("lesson", {
        title: lsn.lessonTitle,
        cid: thisCourse._id,
        cname: thisCourse.courseTitle,
        lesson: lsn,
        isCreator: AccessController.userIsCreator(
          thisCourse,
          req.user.username
        ),
      });
    } else {
      throw new AppErrors.Error400(
        "You are not authorised to view this page or lesson not found"
      );
    }
  } catch (error) {
    next(error);
  }
};

export const addOrUpdateLesson = async function (req, res, next) {
  try {
    let thisCourse = await LessonService.getCourse(req.params.courseId).catch(
      (err) => {
        throw err;
      }
    );
    if (AccessController.userIsCreator(thisCourse, req.user.username)) {
      await LessonService.addOrUpdateLesson(req.params.courseId, {
        $push: { lessons: req.body },
      }).catch((err) => {
        throw err;
      });

      res.status(200).json({ status: "ok" });
    } else {
      throw new AppErrors.Error403(
        "You are not the creator and could not add or update lessons"
      );
    }
  } catch (error) {
    next(error);
  }
};

export const deleteLesson = async function (req, res, next) {
  try {
    const lid = req.params.lsnId; //lesson ID
    let thisCourse = await LessonService.getCourseByLessonId(lid).catch(
      (err) => {
        throw err;
      }
    );
    if (AccessController.userIsCreator(thisCourse, req.user.username)) {
      const del = await LessonService.deleteLesson(lid);
      res.status(200).json({ status: "ok" });
    } else {
      throw new AppErrors.Error403(
        "You are not authorised to delete lessons from this course"
      );
    }
  } catch (error) {
    next(error);
  }
};
