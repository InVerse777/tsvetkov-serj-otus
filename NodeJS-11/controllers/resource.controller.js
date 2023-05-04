import * as ResourceService from "../services/resource.service.js";
import * as AppErrors from "../errorHandling/errors.js";
export const addResource = async function (req, res, next) {
  try {
    const doc = await ResourceService.addResource(
      req.params.lessonId,
      req.body,
      req.user.username
    ).catch((err) => {
      throw err;
    });
    if (doc) {
      res.status(200).json(doc).end();
    } else {
      throw new AppErrors.Error403(
        "You are not authorized to add resourses to lessons in this course"
      );
    }
  } catch (error) {
    next(error);
  }
};

export const editResource = async function (req, res, next) {
  try {
    const doc = await ResourceService.editResource(
      req.params.lessonId,
      req.params.resId,
      req.body,
      req.user.username
    ).catch((err) => {
      throw err;
    });
    if (doc) {
      res.status(200).json(doc).end();
    } else {
      throw new AppErrors.Error400(
        "You are not authorized to edit Resources or wrong resId or lessonId in request"
      );
    }
  } catch (error) {
    next(error);
  }
};
export const deleteResource = async function (req, res, next) {
  try {
    const doc = await ResourceService.deleteResource(
      req.params.lessonId,
      req.params.resId,
      req.user.username
    ).catch((err) => {
      throw err;
    });
    if (doc) {
      res.status(200).json(doc).end();
    } else {
      throw new AppErrors.Error400(
        "You are not authorized to edit Resources or wrong resId or lessonId in request"
      );
    }
  } catch (error) {
    next(error);
  }
};
