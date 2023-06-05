import Courses from "../models/Courses.js";

export const findCourses = async function () {
  return await Courses.find({},'_id courseCreator courseTitle courseDescription publishDate');
};
