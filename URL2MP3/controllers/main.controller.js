import * as MainService from "../services/main.service.js";
import * as TelegreamService from "../services/telegram.service.js";
import { validateUrl } from "../services/url2mp3.service.js";



export const processMessage = async function (req, res) {
  const chatId = req.body.message.chat.id;
  const sentMessage = req.body.message.text;
  console.log("Processing new message");
  if (sentMessage === "/start") {
    MainService.sendGreetingMessage(chatId)
      .then((response) => {
        typeof response === "error"
          ? res.status(400).send()
          : res.status(200).send();
      })
      .catch((error) => {
        res.status(400).send();
      });
  } else if (validateUrl(sentMessage)) {
    MainService.processURL(sentMessage, chatId); //intentionally without await
    res.status(200).send();
  } else {
    TelegreamService.sendMessage(
      chatId,
      `Still whaiting for any valid URL or command! Currently accepting only youtube urls`
    ).then(() => res.status(200).send());
  }
};

