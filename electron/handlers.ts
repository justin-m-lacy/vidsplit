import { dialog, ipcMain, type App, type IpcMain } from "electron";
import { unlink } from 'fs/promises';
import path from "path";
import { SliceOp } from '../shared/edits';
import { concatMedia } from "./ffmpeg/concat";
import { probeTypes } from "./ffmpeg/probe";
import { trimMedia } from "./ffmpeg/slice";

const fixPath = (p: string) => {
	return p.replaceAll('\\', '/');
}

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

	ipcMain.handle('save-slice', async (_, op: SliceOp) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const inPath = (op.filePath);
		const outPath = withExt((dialogRes.filePath), inPath);

		const ext = path.extname(inPath);
		const baseName = path.basename(inPath).slice(0, inPath.lastIndexOf('.'));

		const fileInfo = probeTypes(inPath);

		if (op.slices.length === 1) {
			return await trimMedia(op.slices[0], inPath, outPath);
		}

		const tempDir = path.dirname(inPath);
		const tmpFiles = op.slices.map((s, i) => {
			return path.join(tempDir, baseName + '_' + i + `${ext}`);
		});

		// copy parts to temp files.
		await Promise.all(tmpFiles.map((tmpFile, i) => {
			return trimMedia(op.slices[i], inPath, tmpFile);
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

