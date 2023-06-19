import { url2mp3 } from "./url2mp3.service.js";
import * as TelegramService from "./telegram.service.js";
import fs from "node:fs";

export const sendGreetingMessage = async function (chatId) {
  const greetingMessage =
    "Hi! I'm url2mp3 bot and I can help you extract mp3's \
      from videos of popular videohostings. Just send me a valid \
      url and I will return you an mp3 ASAP;-)\n P.S. Bot can currently send audio files of up to 50 MB in size";
  return await TelegramService.sendMessage(chatId, greetingMessage);
};

export const processURL = async function (url, chatId) {
  const startProcessMessage = "Processing provided URL. Will return mp3 ASAP!";
  try {
    await TelegramService.sendMessage(chatId, startProcessMessage);
    const downloadResult = await url2mp3(url); //returns audioPath or Error
    if (typeof downloadResult === "error") {
      await TelegramService.sendMessage(chatId, downloadResult.message);
      return;
    } else {
      if (sizeGreaterThenLimit(downloadResult)) {
        await TelegramService.sendMessage(
          chatId,
          "Sorry, could not upload the mp3. File size greater then the limit (50mb)"
        );
        return;
      }
      await TelegramService.sendAudio(chatId, downloadResult);
      return;
    }
  } catch (error) {
    await TelegramService.sendMessage(chatId, error.message);
  }
};

const sizeGreaterThenLimit = function (filePath) {
  const stats = fs.statSync(filePath);
  const fileSizeInBytes = stats.size;
  if (fileSizeInBytes > 50 * 1000 * 1000) return true;
  return false;
};
