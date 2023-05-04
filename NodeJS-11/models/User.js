import mongoose from "../db/connection.js";
const Schema = mongoose.Schema;
const model = mongoose.model;
// User Schema
const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  access: [{ course_id: Number, course_name: String }],
});

// User model
const User = model("User", UserSchema);

export default User;
