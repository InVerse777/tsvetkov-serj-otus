import ytdl from "ytdl-core";
import Ffmpeg from "fluent-ffmpeg";
import path from "node:path";
import fs from "node:fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
const downloadsFolder = "downloads";
const downloadsPath = path.join(dirname(fileURLToPath(import.meta.url)), '..', downloadsFolder);
const fileExists = async function (path) {
  return fs.promises
    .access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
};
export const validateUrl = function (videoUrl) {
  return ytdl.validateURL(videoUrl);
};

export const url2mp3 = async function (videoUrl) {
  let bestFormat;
  
  const info = await ytdl.getInfo(videoUrl);
  const videoTitle = info.videoDetails.title;
  const audioPath = path.join(
    downloadsPath,
    videoTitle + ".mp3"
  );
  if (await fileExists(audioPath)) {
    return audioPath;
  } else {
    const audioFormats = ytdl.filterFormats(info.formats, "audioonly");
    //check if we have audioonly formats for the video
    bestFormat = audioFormats.length
      ? ytdl.chooseFormat(audioFormats, { quality: "highestaudio" })
      : ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    //PS need more investigation...Can audio quality in a video be higher than onlyaudio quality?
    //If so...add audioQuality comparison to choose best source
    const videoStream = ytdl.downloadFromInfo(info, { format: bestFormat });

    const downloadResult = await new Promise((resolve, reject) => {
      let x = new Ffmpeg(videoStream)
        .audioQuality(0) //vital
        .withAudioCodec("libmp3lame") //optional
        .toFormat("mp3") //optional
        .saveToFile(audioPath)
        .on("error", (err) => {
          reject(new Error("Wow, an error happened:" + err));
        })
        .on("end", function () {
          resolve(audioPath);
        });
    });
    return downloadResult;
  }
};

fs.promises.mkdir(downloadsPath).catch(()=>{})