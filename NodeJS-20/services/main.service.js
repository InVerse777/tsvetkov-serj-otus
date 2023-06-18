const restApiAddress = "http://localhost:4000"; //move to .env later
import axios from "axios";
import fs from "node:fs/promises";
import prompt from "prompt";
import * as schemas from "../schemas.js";
import { promisify } from "util";
import { URL } from "url";
import path from "node:path";
const get = promisify(prompt.get);

const axiosInstance = axios.create({
  baseURL: restApiAddress,
});
export const loadCookieFromFS = async function () {
  try {
    const __dirname = new URL("..", import.meta.url).pathname;
    const cookie = await fs.readFile(
      path.join(__dirname, "cli_data", "jwt.json"),
      "utf-8"
    );
    axiosInstance.defaults.headers.Cookie = cookie;
    return true;
  } catch (err) {
    return false;
  }
};

export const login = async function (options) {
  const { username, password } = options;
  try {
    const response = await axiosInstance.post("/user/login", {
      username: username,
      password: password,
    });

    if (response.status === 200) {
      const [cookie] = response.headers["set-cookie"];
      axiosInstance.defaults.headers.cookie = cookie;
      await fs.writeFile("./cli_data/jwt.json", cookie, "utf-8");
      console.log(`Successfull login of ${username}`);
    }
  } catch (error) {
    if (error.response && error.response.data)
      console.log(`Error:${error.response.data}`);
    else console.log(error);
  }
};

export const addCourse = async function () {
  try {
    prompt.start();
    const result = await get(schemas.course);
    const response = await axiosInstance.post(`/course`, {
      courseTitle: result.courseTitle,
      courseDescription: result.courseDescription,
    });
    logResponse(response);
  } catch (err) {
    if (err.response && err.response.data) {
      console.log(err.response.data);
    }
  }
};
export const showCourse = async function (options) {
  try {
    const { courseId } = options;
    const response = await axiosInstance.get(`/coursej/${courseId}`);
    logResponse(response);
  } catch (err) {
    if (err.response && err.response.data) {
      console.log(err.response.data);
    }
  }
};
export const patchCourse = async function (options) {
  const { courseId } = options;
  const response = await axiosInstance.get(`/coursej/${courseId}`);
  if (response.status === 200) {
    const patchCourseSchema = schemas.course;
    patchCourseSchema.properties.courseTitle.default =
      response.data.courseTitle;
    patchCourseSchema.properties.courseDescription.default =
      response.data.courseDescription;
    prompt.start();
    const result = await get(patchCourseSchema);
    const response = await axiosInstance.patch(`/course/${courseId}`, {
      courseTitle: result.courseTitle,
      courseDescription: result.courseDescription,
    });
    logResponse(response);
  } else {
    console.log(response.data);
  }
};
export const showCourses = async function () {
  try {
    const response = await axiosInstance.get("/coursesj");
    logResponse(response);
  } catch (err) {}
};
export const deleteCourse = async function (options) {
  try {
    const { courseId } = options;
    const response = await axiosInstance.delete(`/course/${courseId}`);
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};
export const editLesson = async function (options) {
  try {
    const { courseId } = options;

    prompt.start();
    const result = await get(schemas.lesson_id);
    const dLesson = await axiosInstance.get(`/lessonj/${result._id}`);
    if (dLesson) {
      const editLessonSchema = schemas.lesson;
      editLessonSchema.properties.lessonDescription.default =
        dLesson.data.lessonDescription;
      editLessonSchema.properties.lessonTitle.default =
        dLesson.data.lessonTitle;
      const postResponse = await get(editLessonSchema);
      const response = await axiosInstance.patch(`/lesson/${courseId}`, {
        _id: result._id,
        lessonTitle: postResponse.lessonTitle,
        lessonDescription: postResponse.lessonDescription,
      });
      logResponse(response);
    } else {
      console.log(response.data);
    }
  } catch (err) {
    console.log(err);
  }
};
export const deleteLesson = async function (options) {
  try {
    const { lessonId } = options;
    const response = await axiosInstance.delete(`/lesson/${lessonId}`);
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};
export const addLesson = async function (options) {
  try {
    const { courseId } = options;
    const course = await axiosInstance.get(`/coursej/${courseId}`);
    if (course) {
      prompt.start();
      const result = await get(schemas.lesson);
      const response = await axiosInstance.post(`/lesson/${courseId}`, {
        lessonTitle: result.lessonTitle,
        lessonDescription: result.lessonDescription,
      });
      logResponse(response);
    } else {
      throw new Error("There is no course with provided id");
    }
  } catch (err) {
    console.log(err);
  }
};
export const deleteResource = async function (options) {
  try {
    const { lessonId, resourceId } = options;

    const response = await axiosInstance.delete(
      `/resource/${lessonId}/${resourceId}`
    );
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};
export const editResource = async function (options) {
  try {
    const { lessonId, resourceId } = options;
    const curResource = await axiosInstance.get(
      `/resource/${lessonId}/${resourceId}`
    );
    const modResourceSchema = schemas.resource;
    modResourceSchema.properties.fnltype.default = curResource.data.fnltype;
    modResourceSchema.properties.fileDescription.default =
      curResource.data.fileDescription;
    modResourceSchema.properties.rLink.default = curResource.data.rLink;
    prompt.start();
    const results = await get(modResourceSchema);
    const response = await axiosInstance.patch(
      `/resource/${lessonId}/${resourceId}`,
      {
        _id: resourceId,
        fnltype: results.fnltype,
        fileDescription: results.fileDescription,
        rLink: results.rLink,
      }
    );
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};

export const addResource = async function (options) {
  try {
    const { lessonId } = options;
    prompt.start();
    const results = await get(schemas.resource);
    const response = await axiosInstance.post(`/resource/${lessonId}`, {
      fnltype: results.fnltype,
      fileDescription: results.fileDescription,
      rLink: results.rLink,
    });
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};

export const deleteComment = async function (options) {
  try {
    const { lessonId, commentId } = options;

    const response = await axiosInstance.delete(
      `/comment/${lessonId}/${commentId}`
    );
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};

export const editComment = async function (options) {
  try {
    const { lessonId, commentId } = options;
    const curComment = await axiosInstance.get(
      `/comment/${lessonId}/${commentId}`
    );
    const modCommentSchema = schemas.comment;
    modCommentSchema.properties.commentText.default =
      curComment.data.commentText;
    prompt.start();
    const results = await get(modCommentSchema);
    const response = await axiosInstance.patch(
      `/comment/${lessonId}/${commentId}`,
      {
        _id: commentId,
        commentText: results.commentText,
      }
    );
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};

export const addComment = async function (options) {
  try {
    const { lessonId } = options;
    prompt.start();
    const results = await get(schemas.comment);
    const response = await axiosInstance.post(`/comment/${lessonId}`, {
      commentText: results.commentText,
    });
    logResponse(response);
  } catch (err) {
    console.log(err);
  }
};

const logResponse = function (response) {
  if (response.status === 200) {
    console.log(response.data);
  } else {
    console.log(`Something went wrong, returned ${response.data}`);
  }
};
