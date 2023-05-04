import * as CoursesService from "../services/courses.service.js";

export const renderCoursesPage = async function (req, res, next) {
  try {
    const coursesList = await CoursesService.findCourses().catch((err) => {
      throw err;
    });
    const userStr = req.user ? req.user.username : "Anonymous user";
    res.render("courses", {
      title: "WebCourseware. Courses",
      courses: coursesList,
      user: userStr,
    });
  } catch (error) {
    next(error);
  }
};
