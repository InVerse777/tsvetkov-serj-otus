import Courses from "../models/Courses.js";

export const getCourseByLessonId = async function (lid) {
  const filter = { "lessons._id": lid };
  return await Courses.findOne(filter);
};
export const saveCourse = async function (thisCourse) {
  return await thisCourse.save();
};
