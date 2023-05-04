import * as dotenv from "dotenv";
dotenv.config();
import mongoose, { Schema } from "mongoose";
const { DATABASE_URL, DB_USER, DB_PASSWORD } = process.env;
mongoose.connect = mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user: DB_USER,
  pass: DB_PASSWORD,
});

mongoose.connection
  .on("open", () => console.log("Connection Open"))
  .on("close", () => console.log("Connection Closed"))
  .on("error", (error) => console.log(`ERROR: ${error}`));

export default mongoose;