import * as AccessController from "../controllers/access.controller.js";
import Courses from "../models/Courses.js";
import * as CourseService from "../services/course.service.js";
import * as AppErrors from "../errorHandling/errors.js";
export const renderCoursePage = async function (req, res, next) {
  try {
    const thisCourse = await CourseService.findCourse(req.params.id).catch(
      (err) => {
        throw err;
      }
    );

    if (AccessController.userHasAccess(thisCourse, req.user.username)) {
      res.render("course", {
        title: thisCourse.courseTitle,
        course: thisCourse,
        isCreator: AccessController.userIsCreator(
          thisCourse,
          req.user.username
        ),
      });
    } else {
      throw new AppErrors.Error403("Your dont have access to this page");
    }
  } catch (error) {
    next(error);
  }
  //res.status(200).end();
};

export const addCourse = async function (req, res, next) {
  try {
    req.body.courseCreator = req.user.username;
    const course = await CourseService.addCourse(req.body).catch((err) => {
      throw err;
    });
    res.json({ id: course._id.toString() });
  } catch (error) {
    next(error);
  }
};

export const patchCourse = async function (req, res, next) {
  try {
    const cid = req.params.courseId;
    const thisCourse = await CourseService.findCourse(cid).catch((err) => {
      throw err;
    });
    if (AccessController.userIsCreator(thisCourse, req.user.username)) {
      await CourseService.updateCourse(cid, req.body).catch((err) => {
        throw err;
      });
      res.status(200).json({ status: "ok" });
    } else {
      throw AppErrors.Error403(
        "Only the creator has permition to edit course data"
      );
    }
  } catch (error) {
    next(error);
  }
};
export const deleteCourse = async function (req, res, next) {
  try {
    const cid = req.params.courseId;
    const doc = CourseService.addCourse(cid).catch((err) => {
      throw err;
    });
    if (AccessController.userIsCreator(doc, req.user.username)) {
      await CourseService.deleteCourse(cid).catch((err) => {
        throw err;
      });
      res.status(200).json({ status: "ok" });
    } else {
      throw AppErrors.Error403("Only the creator has permition to delete");
    }
  } catch (error) {
    next(error);
  }
};

export const grantAccess = async function (req, res, next) {
  try {
    const id = req.params.courseId;
    const userName = req.body.userName;
    const grantorUserName = req.user.username;
    const reqJSON = req.body;
    let doc = await CourseService.findCourse(id);
    if (
      (await CourseService.userExists(userName).catch((err) => {
        throw err;
      })) &&
      !(userName in doc.accessGrantedTo) &&
      AccessController.userIsCreator(doc, grantorUserName)
    ) {
      doc.accessGrantedTo.push(reqJSON);
      await CourseService.saveCourse(doc).catch((err) => {
        throw err;
      });
    } else {
      throw new AppErrors.Error400(
        "Bad request. User does not exist or already has access to this course"
      );
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};

export const revokeAccess = async function (req, res, next) {
  try {
    const revokerUserName = req.user.username;
    const userName = req.body.userName;
    let doc = await CourseService.findCourse(req.params.courseId).catch(
      (err) => {
        throw err;
      }
    );

    const index = doc.accessGrantedTo.findIndex((x) => x.userName === userName);
    if (index != -1 && AccessController.userIsCreator(doc, revokerUserName)) {
      doc.accessGrantedTo.splice(index, 1);
      await CourseService.saveCourse(doc).catch((err) => {
        throw err;
      });
      return true;
    } else
      throw new AppErrors.Error400(
        "User does not have access to this course or you are not authorized to revoke access"
      );
    res.status(200).json({ status: "ok" });
  } catch (error) {
    next(error);
  }
};
