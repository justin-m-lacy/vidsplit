// electron/main.ts
import { app, BrowserWindow, ipcMain as ipcMain2 } from "electron";
import * as path2 from "path";

// electron/handlers.ts
import { exec } from "child_process";
import { dialog, ipcMain } from "electron";
import path from "path";

// electron/ffmpeg/slice.ts
function mapOutput(outFile, audio, outTrack = "out") {
  return ` -map [${outTrack}v]` + (audio ? ` -map [${outTrack}a]` : "") + ` ${outFile}`;
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
  const from = s.from;
  const to = s.to;
  if (audio) {
    const vid = `[0:v]trim=start=${from}:end=${to},setpts=PTS-STARTPTS[${outnum}v];`;
    const aud = `[0:a]atrim=start=${from}:end=${to},asetpts=PTS-STARTPTS[${outnum}a];`;
    return vid + aud;
  } else {
    return `[0]trim=start=${from}:end=${to},setpts=PTS-STARTPTS[${outnum}v];`;
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
var useExt = (outPath, inPath) => {
  if (path.extname(outPath) == "") {
    return outPath + path.extname(inPath);
  }
  return outPath;
};
function handleOpenMedia() {
  return ipcMain.handle("open-media", async (_) => {
    const result = await dialog.showOpenDialog({
      properties: ["openFile"]
    });
    if (result.canceled || result.filePaths.length == 0) return null;
    return {
      path: result.filePaths[0],
      data: null
    };
  });
}
function handleSlice(ipcMain3, app2) {
  ipcMain3.handle("save-slice", async (_, op) => {
    const dialogRes = await dialog.showSaveDialog({ title: "Save Output" });
    if (dialogRes.canceled) {
      return null;
    }
    const inPath = op.filePath;
    const outPath = useExt(dialogRes.filePath, inPath);
    const cmd = buildSliceCmd(op.slices, inPath, outPath);
    const result = await new Promise(
      (res, rej) => exec(cmd, (err) => {
        if (err) rej(err);
        else res(outPath);
      })
    );
    return result;
  });
}

// electron/main.ts
var createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path2.join(import.meta.dirname, "preload.js"),
      contextIsolation: true
    }
  });
  handleOpenMedia();
  handleSlice(ipcMain2, app);
  win.loadFile(path2.join(import.meta.dirname, "./render/index.html"));
};
app.whenReady().then(createWindow);
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});
