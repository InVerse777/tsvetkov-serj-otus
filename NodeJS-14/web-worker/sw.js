importScripts("/socket.io/socket.io.js");
let getVersionPort;

const socket = io("https://localhost:3005", { transports: ["websocket"] });

socket.on("notification", (notification) => {
  if (getVersionPort) {
    getVersionPort.postMessage(notification.notification);
  } else {
    console.log("message channel not established");
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_PORT") {
    getVersionPort = event.ports[0];
  }
});
