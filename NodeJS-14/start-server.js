const express = require("express");
const path = require("node:path");
const app = express();
const fs = require("node:fs");
const https = require("https");
const { Server } = require("socket.io");
let messageCounter = 0;
const key = fs.readFileSync(path.join(__dirname, "certs", "localhost.key"));
const crt = fs.readFileSync(path.join(__dirname, "certs", "localhost.crt"));
const options = {
  key: key,
  cert: crt,
};
const server = https.createServer(options, app);
const io = new Server(server);
app.use(express.static("web-worker"));
app.use(express.static("client_scripts"));
app.get("/", (req, res) => {
  res.sendFile("views/start.html", { root: __dirname });
});

const generateNotification = function () {
  const sometext = `This is notification number ${++messageCounter}`;
  return { title: "Notification from server", body: { body: sometext } };
};

io.on("connection", (socket) => {
  console.log("a user connected");
  let interval = setInterval(() => makeNotification(socket), 5000);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    clearInterval(interval);
  });
});
const makeNotification = async function (socket) {
  socket.emit("notification", { notification: generateNotification() });
};
server.listen(3005, () => {
  console.log("listening on *:3005");
});
