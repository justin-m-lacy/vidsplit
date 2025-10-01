import { BrowserWindow, dialog, ipcMain, type App, type IpcMain } from 'electron';
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

export function handleSlice(ipcMain: IpcMain, win: BrowserWindow, app: App) {

	ipcMain.handle('sliceMedia', async (evt, op: NodeSliceOp) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const inPath = op.filePath;
		const outPath = withExt((dialogRes.filePath), inPath);

		const ext = path.extname(inPath);
		const baseName = path.basename(inPath).slice(0, inPath.lastIndexOf('.'));

		const updates = createUpdaters(win, op.id);

		if (op.slices.length === 1) {
			await saveSlice(op.slices[0], inPath, outPath, updates[0]);
			win.setProgressBar(0);
			return outPath;
		}

		const tempDir = path.dirname(inPath);
		const tmpFiles = op.slices.map((_, i) => {
			return path.join(tempDir, baseName + '_' + i + `${ext}`);
		});

		// copy parts to temp files.
		await Promise.all(tmpFiles.map((tmpFile, i) => {
			return saveSlice(op.slices[i], inPath, tmpFile, updates[i]);
		}));

		await concatMedia(tmpFiles, outPath, tempDir);

		try {
			Promise.allSettled(tmpFiles.map(f => unlink(f)))
		} catch (err) {
			console.warn(`error removing files: ${err}`);
		}

		win.setProgressBar(0);

		return outPath;

	});

}


export function handleSplit(ipcMain: IpcMain, win: BrowserWindow, app: App) {

	ipcMain.handle('splitMedia', async (evt, op: NodeSplitOp) => {

		// pick save dir?
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

		const updates = createUpdaters(win, op.id);

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
				path.join(baseDir, `${baseName}-${i}${ext}`),
				updates[i]
			));
			if (i > 0) sliceEnd = cuts[i - 1].t

		}

		// copy parts to files.
		await Promise.allSettled(saves);
		win.setProgressBar(0);

		return true;

	});

}

/**
 * 
 * @param to 
 * @param id 
 * @param parts - number of separate parts opertation is broken into.
 * @returns 
 */
function createUpdaters(win: BrowserWindow,
	id: string,
	parts: number = 1, trayUpdate: boolean = true) {

	let total = 0;
	let current = 0;

	// current/total for each sub-part.
	const subTotals = new Array<number>(parts).fill(0);
	const subProgs = new Array<number>(parts).fill(0);

	const to = win.webContents;

	return subProgs.map((_, i) => {

		// update sub current, sub total.
		return (subCur, subTot) => {

			// rough estimate only. current sometimes > total
			current += (subCur - subProgs[i]);
			total += (subTot - subTotals[i]);

			subProgs[i] = subCur;
			subTotals[i] = subTot;

			to.send('progress', id, current, total);
			if (trayUpdate) {
				win.setProgressBar(Math.min(current / total, 1));
			}

		}

	});

}