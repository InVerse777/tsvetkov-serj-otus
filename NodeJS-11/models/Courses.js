const { Schema, model } = require("../db/connection");

// User Schema
const CoursesSchema = new Schema({
  courseCreator: { type: String, required: true },
  courseTitle: { type: String, unique: true, required: true },
  courseDescription: { type: String, required: true },
  publishDate: { type: Date, default: () => new Date() },
  lessons: [
    {
      lessonTitle: String,
      lessonDescription: String,
      comments: [
        {
          commentAuthor: String,
          commentText: String,
          commentDate: { type: Date, default: () => new Date() },
        },
      ],
      lessonFilesNLinks: [
        { fnltype: String, fileDescription: String, rLink: String },
      ],
    },
  ],
  accessGrantedTo: [{ userName: String }],
});

// User model
const Courses = model("Courses", CoursesSchema);

module.exports = Courses;
