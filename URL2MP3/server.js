import express from "express";
const app = express();
import bodyParser from "body-parser";
import * as MainController from "./controllers/main.controller.js";

const port = 8066;

app.use(bodyParser.json());
app.post("/", await MainController.processMessage);
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
