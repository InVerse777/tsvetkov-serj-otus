import Courses from "../models/Courses.js";

export const addResource = async function (lessonId, resJSON, userName) {
  const filter = { "lessons._id": lessonId };
  const doc = await Courses.findOne(filter);
  if (userName === doc.courseCreator) {
    const lesIndex = doc.lessons.findIndex(
      (x) => x._id.toString() === lessonId
    );
    doc.lessons[lesIndex].lessonFilesNLinks.push(resJSON);
    await doc.save();
    return doc;
  } else return false;
};

export const editResource = async function (lessonId, resId, resJSON, userName) {
  try {
    const filter = { "lessons._id": lessonId };
    const thisCourse = await Courses.findOne(filter);
    const lesIndex = thisCourse.lessons.findIndex((x) => x._id.toString() === lessonId);
    if (lesIndex !== -1 && userName === thisCourse.courseCreator) {
      const resIndex = thisCourse.lessons[lesIndex].lessonFilesNLinks.findIndex(
        (x) => x.id == resId
      );
      thisCourse.lessons[lesIndex].lessonFilesNLinks[resIndex] = resJSON;
      await thisCourse.save();
      return thisCourese;
    } else {
      return false;
    }
  } catch (err) {
    res.status(400).json({ err });
  }
};

export const deleteResource = async function (lessonId, resId, userName) {
  const filter = { "lessons._id": lessonId };
  const doc = await Courses.findOne(filter);
  const lesIndex = doc.lessons.findIndex((x) => x._id.toString() === lessonId);
  if (lesIndex !== -1 && userName === thisCourse.courseCreator) {
    const resIndex = doc.lessons[lesIndex].lessonFilesNLinks.findIndex(
      (x) => x.id === resId
    );
    if (resIndex !== -1) {
      doc.lessons[lesIndex].lessonFilesNLinks.splice(resIndex, 1);
      await doc.save();
      return doc;
    } else {
      return false; //{ err: "No such resource" };
    }
  } else {
    return false; //{ err: "No such lesson" };
  }
};
