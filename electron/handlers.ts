import { dialog, ipcMain, type App, type IpcMain } from "electron";
import { unlink } from 'fs/promises';
import path from "path";
import { NodeSliceOp, NodeSplitOp } from "../shared/edits";
import { concatMedia } from "./ffmpeg/concat";
import { saveSlice } from "./ffmpeg/slice";
//import { probeTypes } from "./ffmpeg/probe";

const withExt = (outPath: string, inPath: string) => {
	if (path.extname(outPath) == '') {
		return outPath + path.extname(inPath);
	}
	return outPath;
}
export function handleOpenMedia() {

	return ipcMain.handle('open-media', async (_,) => {

		const result = await dialog.showOpenDialog({
			properties: ['openFile']
		});

		if (result.canceled || result.filePaths.length == 0) return null;
		return {
			path: result.filePaths[0],
			data: null
		}

	});

}

export function handleSlice(ipcMain: IpcMain, app: App) {

	ipcMain.handle('sliceMedia', async (_, op: NodeSliceOp) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const inPath = op.filePath;
		const outPath = withExt((dialogRes.filePath), inPath);

		const ext = path.extname(inPath);
		const baseName = path.basename(inPath).slice(0, inPath.lastIndexOf('.'));

		if (op.slices.length === 1) {
			return await saveSlice(op.slices[0], inPath, outPath);
		}

		const tempDir = path.dirname(inPath);
		const tmpFiles = op.slices.map((s, i) => {
			return path.join(tempDir, baseName + '_' + i + `${ext}`);
		});

		// copy parts to temp files.
		await Promise.all(tmpFiles.map((tmpFile, i) => {
			return saveSlice(op.slices[i], inPath, tmpFile);
		}));

		await concatMedia(tmpFiles, outPath, tempDir);

		try {
			Promise.allSettled(tmpFiles.map(f => unlink(f)))
		} catch (err) {
			console.warn(`error removing files: ${err}`);
		}

		return outPath;

	});

}

export function handleSplit(ipcMain: IpcMain, app: App) {

	ipcMain.handle('splitMedia', async (_, op: NodeSplitOp) => {

		/*const dialogRes = await dialog.showSaveDialog({ title: 'Save Files As...' });
		if (dialogRes.canceled) {
			return false;
		}*/

		const inPath = op.filePath;
		const baseDir = path.dirname(inPath);

		const ext = path.extname(inPath);
		const baseName = path.basename(inPath).slice(0, inPath.lastIndexOf('.'));

		const cuts = op.cuts;
		const saves: Promise<string>[] = [];

		let sliceEnd = op.duration;
		for (let i = cuts.length; i >= 0; i--) {

			saves.push(saveSlice(
				i > 0 ? {
					from: cuts[i - 1].t,
					to: sliceEnd
				} : {
					from: 0, to: sliceEnd
				},
				inPath,
				path.join(baseDir, `${baseName}-${i}${ext}`)
			));
			if (i > 0) sliceEnd = cuts[i - 1].t

		}

		// copy parts to files.
		await Promise.allSettled(saves);

		return true;

	});

}