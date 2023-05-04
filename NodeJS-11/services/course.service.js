import Courses from "../models/Courses.js";
import User from "../models/User.js";
import * as AccessController from "../controllers/access.controller.js";
import * as AppErrors from "../errorHandling/errors.js";
export const findCourse = async function (id) {
  return await Courses.findOne({ _id: id });
};
export const addCourse = async function (reqJSON) {
  return await Courses.create(reqJSON);
};

export const updateCourse = async function (id, reqJSON) {
  return await Courses.updateOne({ _id: id }, reqJSON);
};

export const deleteCourse = async function (id) {
  return await Courses.deleteOne({ _id: id });
};
export const saveCourse = async function (doc) {
  await doc.save();
};
export const userExists = async function(userName){
  return await User.exists({ username: userName })
}