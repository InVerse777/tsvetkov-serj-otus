import Courses from "../models/Courses.js";
export const getCourse = async function (courseId) {
  let filter = { _id: courseId };
  return await Courses.findOne(filter);
};
export const getCourseByLessonId = async function (lid) {
  let filter = { "lessons._id": lid };
  return await Courses.findOne(filter);
};

export const addOrUpdateLesson = async function (lid, params) {
  let filter = { "_id": lid };
  await Courses.findOneAndUpdate(filter, params);
};

export const deleteLesson = async function (lid) {
  const filter = { "lessons._id": lid };
  const del = await Courses.updateOne(
    filter,
    { $pull: { lessons: { _id: lid } } },
    { safe: true, multi: true }
  );
  if (del) return true;
  else return false;
};
