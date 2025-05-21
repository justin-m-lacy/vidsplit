// electron/main.ts
import { app, BrowserWindow, ipcMain } from "electron";
import * as path from "path";

// electron/handlers.ts
import { exec } from "child_process";
import { dialog } from "electron";

// electron/ffmpeg/slice.ts
function mapOutput(outFile, audio, outTrack = "out") {
  return ` -map [${outTrack}v]` + (audio ? `[${outTrack}a]` : "") + ` ${outFile}`;
}
function makeConcat(slices, audio, outTrack = "out") {
  if (audio) {
    const inputs = slices.map((_, i) => `[${i}v][${i}a]`).join("");
    return `${inputs}concat=n=${slices.length}:v=1:a=1[${outTrack}v][${outTrack}a]`;
  } else {
    const inputs = slices.map((_, i) => `[${i}v]`).join("");
    return `${inputs}concat=n=${slices.length}[${outTrack}v]`;
  }
}
function makeTrimPart(s, outnum, audio) {
  if (audio) {
    const vid = `[0:v]trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;
    const aud = `[0:a]atrim=start=${s.from}:end=${s.to},asetpts=PTS-STARTPTS[${outnum}a];`;
    return vid + aud;
  } else {
    return `[0]trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;
  }
}
function makeFilterInput(inUrl) {
  return `ffmpeg -y -i ${inUrl} -filter_complex `;
}
function buildSliceCmd(slices, inUrl, outUrl, audio = true) {
  let filter = makeFilterInput(inUrl);
  filter += slices.map((s, i) => makeTrimPart(s, i, audio)).join("");
  filter += makeConcat(slices, audio);
  filter += mapOutput(outUrl, audio);
  return filter;
}

// electron/handlers.ts
function handleSlice(ipcMain2) {
  ipcMain2.handle("save-slice", async (_, op) => {
    const dialogRes = await dialog.showSaveDialog({ title: "Save Output" });
    if (dialogRes.canceled) {
      return null;
    }
    const outPath = dialogRes.filePath;
    const cmd = buildSliceCmd(op.slices, op.mediaUrl, outPath);
    return new Promise(
      (res, rej) => exec(cmd, (err) => {
        if (err) rej(err);
        else res(outPath);
      })
    );
  });
}

// electron/main.ts
var createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(import.meta.dirname, "preload.js"),
      contextIsolation: true
    }
  });
  handleSlice(ipcMain);
  win.loadFile(path.join(import.meta.dirname, "./render/index.html"));
};
app.whenReady().then(createWindow);
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});
