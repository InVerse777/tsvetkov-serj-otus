#!/usr/bin/env node
import { program } from "commander/esm.mjs";
//import { description, version } from "./package.json";
//import prompt from 'prompt'
import * as mainService from "./services/main.service.js";
const description = "lsdfjals";
const version = "sldjfsj";

await mainService.loadCookieFromFS();

program.description(description).version(version, "-v, - version");

program
  .command("login")
  .requiredOption("-u, --username <username>", "Username")
  .requiredOption("-p, --password <password>", "Password")
  .description("Authentication of the user")
  .action(await mainService.login);

program
  .command("showCourses")
  .description("Shows list of available courses with their ids")
  .action(await mainService.showCourses);

program
  .command("showCourse")
  .requiredOption("-i --courseId <courseId>", "course id")
  .description("Shows course by id")
  .action(await mainService.showCourse);

program
  .command("addCourse")
  .description("Adds new course")
  .action(await mainService.addCourse);

program
  .command("patchCourse")
  .requiredOption("-i --courseId <courseId>", "course id")
  .description("Edit course by id")
  .action(await mainService.patchCourse);

program
  .command("deleteCourse")
  .requiredOption("-i --courseId <courseId>", "course id")
  .description("Delete course by id")
  .action(await mainService.deleteCourse);
program
  .command("addLesson")
  .requiredOption("-i --courseId <courseId>", "course id")
  .description("Adds lesson to course with id")
  .action(await mainService.addLesson);
program
  .command("editLesson")
  .requiredOption("-i --courseId <courseId>", "course id")
  .description("Edits lesson of course with id")
  .action(await mainService.editLesson);
program
   .command("deleteLesson")
   .requiredOption("-i --lessonId <lessonId>", "lesson id")
   .description("Deletes lesson with id")
   .action(await mainService.deleteLesson)
program
.command("addResource")
.requiredOption("-i --lessonId <lessonId>", "lesson id")
.description("Adds resource to lesson with id")
.action(await mainService.addResource)
program
.command("editResource")
.requiredOption("-i --resourceId <resourceId>", "resource id")
.requiredOption("-l --lessonId <lessonId>", "lesson id")
.description("Edits specified resource")
.action(await mainService.editResource)
program
.command("deleteResource")
.requiredOption("-i --resourceId <resourceId>", "resource id")
.requiredOption("-l --lessonId <lessonId>", "lesson id")
.description("Delete specified resource")
.action(await mainService.deleteResource)
program
.command("addComment")
.requiredOption("-i --lessonId <lessonId>", "lesson id")
.description("Adds comment to lesson with id")
.action(await mainService.addComment)
program
.command("editComment")
.requiredOption("-i --commentId <commentId>", "comment id")
.requiredOption("-l --lessonId <lessonId>", "lesson id")
.description("Edits specified comment")
.action(await mainService.editComment)
program
.command("deleteComment")
.requiredOption("-i --commentId <commentId>", "comment id")
.requiredOption("-l --lessonId <lessonId>", "lesson id")
.description("Deletes specified comment")
.action(await mainService.deleteComment)



program.parse();
