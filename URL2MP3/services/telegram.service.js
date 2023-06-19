import axios from "axios";
import FormData from "form-data";
import fs from "node:fs";
import "dotenv/config";

const url = "https://api.telegram.org/bot";
const apiToken = process.env.TELEGRAM_API_TOKEN;

export const sendMessage = async function (chatId, message) {
  try {
    const response = await axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
    });
    return response;
  } catch (err) {
    return err;
  }
};

export const sendAudio = async function (chatId, audioPath) {
  const data = new FormData();
  data.append("chat_id", chatId);
  data.append("audio", fs.createReadStream(audioPath));
  const headers = {
    accept: "application/json",
    "Content-Type": "multipart/form-data",
  };
  return await axios
    .post(`${url}${apiToken}/sendAudio`, data, headers)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
};
