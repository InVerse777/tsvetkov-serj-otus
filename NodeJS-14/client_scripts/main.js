const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js"); //{     scope: "https://localhost:3005/",      }
      return registration;
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};
const messageChannel = new MessageChannel();
const setupMessageChannel = function () {
  navigator.serviceWorker.ready.then((registration) => {
    registration.active.postMessage(
      {
        type: "INIT_PORT",
      },
      [messageChannel.port2]
    );
    messageChannel.port1.onmessage = (message) => {
      registration.showNotification(message.data.title, message.data.body);
    };
  });
};
const startWorker = async function () {
  const registration = await registerServiceWorker();
  setupMessageChannel(registration);
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications.");
  } else {
    Notification.requestPermission((permission) => {
      console.log(permission);
    });
  }
};
