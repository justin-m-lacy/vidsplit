import { BrowserWindow, dialog, WebContents, type App, type IpcMain } from 'electron';
import { unlink } from 'fs/promises';
import { tmpdir } from 'os';
import path from "path";
import { NodeEncodeOp, NodeSliceOp, NodeSplitOp, SliceInfo } from "../../shared/edits";
import { TaskUpdate } from '../../shared/types';
import { concatFromFiles } from "../ffmpeg/concat";
import { ProgressUpdater, saveSlice } from "../ffmpeg/slice";
import { copyExt } from '../util/files';

export function handleOpenMedia(ipcMain: IpcMain) {

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

/**
 * Handle rencoding with no slicing/cutting.
 */
export function handleEncode(ipcMain: IpcMain, _app: App) {

	ipcMain.handle('encodeMedia', async (evt, op: NodeEncodeOp) => {

		const dialogRes = await dialog.showSaveDialog({
			title: 'Save Output',
			defaultPath: op.filePath,

		});
		if (dialogRes.canceled) {
			sendTaskState(evt.sender, { id: op.id, state: 'canceled' });
			return;
		}

		const inPath = op.filePath;
		const outPath = copyExt((dialogRes.filePath), inPath);
		const updates = createUpdaters(evt.sender, op.id);

		await saveSlice({
			range: { from: 0, to: op.duration },
			inUrl: inPath,
			outUrl: outPath,
			progress: updates[0],
			codec: op.codec
		});

		sendTaskState(evt.sender,
			{ id: op.id, state: 'complete', result: outPath });

	});

}

function sendTaskState(web: WebContents, state: TaskUpdate) {
	web.send('taskstate', state);
	BrowserWindow.fromWebContents(web)?.setProgressBar(0);
}

export function handleSlice(ipcMain: IpcMain, _app: App) {

	ipcMain.handle('sliceMedia', async (evt, op: NodeSliceOp) => {

		const dialogRes = await dialog.showSaveDialog({
			title: 'Save Output',
			defaultPath: op.filePath,

		});
		if (dialogRes.canceled) {
			sendTaskState(evt.sender, { id: op.id, state: 'canceled' });
			return;
		}

		const inPath = op.filePath;
		const outPath = copyExt((dialogRes.filePath), inPath);
		const updates = createUpdaters(evt.sender, op.id);

		if (op.type == 'cut') {
			invertSlices(op);
		}

		if (op.slices.length === 1) {

			await saveSlice({
				range: op.slices[0],
				inUrl: inPath,
				outUrl: outPath,
				progress: updates[0],
				lead: op.lead,
				codec: op.codec
			});

		} else {
			await saveMultiSlice(inPath, outPath, op, updates);
		}

		sendTaskState(evt.sender,
			{ id: op.id, state: 'complete', result: outPath });

	});

}

async function saveMultiSlice(inPath: string, outPath: string, op: NodeSliceOp, updates?: ProgressUpdater[]) {

	const ext = path.extname(inPath);
	const baseName = path.basename(inPath, ext);

	const tempDir = tmpdir();
	const tmpFiles = op.slices.map((_, i) => path.join(tempDir, baseName + '_' + i + `${ext}`));

	try {
		// copy parts to temp files.
		await Promise.all(tmpFiles.map((tmpFile, i) => saveSlice({
			range: op.slices[i],
			inUrl: inPath,
			outUrl: tmpFile,
			progress: updates?.[i],
			lead: op.lead,
			codec: op.codec
		})));

		await concatFromFiles(tmpFiles, outPath, tempDir);

	} catch (err) {
		console.warn(`error removing files: ${err}`);
	} finally {

		Promise.allSettled(tmpFiles.map(f => unlink(f)));
	}

}

export function handleSplit(ipcMain: IpcMain, app: App) {

	ipcMain.handle('splitMedia', async (evt, op: NodeSplitOp) => {

		const inPath = op.filePath;
		const baseDir = path.dirname(inPath);

		const ext = path.extname(inPath);
		const baseName = path.basename(inPath, ext);

		const cuts = op.cuts;
		const saves: Promise<string>[] = [];

		const updates = createUpdaters(evt.sender, op.id);

		let sliceEnd = op.duration;
		for (let i = cuts.length; i >= 0; i--) {

			saves.push(saveSlice({
				range: {
					from: i > 0 ? cuts[i - 1].t : 0,
					to: sliceEnd
				},
				inUrl: inPath,
				outUrl: path.join(baseDir, `${baseName}-${i}${ext}`),
				progress: updates[i],
				lead: op.lead,
				codec: op.codec
			}));
			if (i > 0) sliceEnd = cuts[i - 1].t

		}

		// copy parts to files.
		await Promise.allSettled(saves);
		sendTaskState(evt.sender, { id: op.id, state: 'complete', result: saves.join('\n') });

	});

}

/**
 * 
 * @param to 
 * @param id 
 * @param parts - number of separate parts opertation is broken into.
 * @returns 
 */
function createUpdaters(web: WebContents,
	id: string,
	parts: number = 1, trayUpdate: boolean = true) {

	let total = 0;
	let current = 0;

	// current/total for each sub-part.
	const subTotals = new Array<number>(parts).fill(0);
	const subProgs = new Array<number>(parts).fill(0);

	return subProgs.map((_, i) => {

		// update sub current, sub total.
		return (subCur: number, subTot: number) => {

			// estimate only. current sometimes > total
			current += (subCur - subProgs[i]);
			total += (subTot - subTotals[i]);

			subProgs[i] = subCur;
			subTotals[i] = subTot;

			web.send('progress', id, current, total);
			if (trayUpdate) {
				BrowserWindow.fromWebContents(web)?.setProgressBar(
					Math.min(current / total, 1)
				);
			}

		}

	});

}

/**
 * Convert slice points to skip points.
 * (Used for cut operation.)
 */
function invertSlices(op: NodeSliceOp) {

	const cuts = op.slices;
	const slices = <SliceInfo[]>[];

	// sort cuts by earliest cutting point.
	cuts.sort((a, b) => a.from - b.from)

	let sliceStart = 0;

	for (let i = 0; i < cuts.length; i++) {

		if (sliceStart < cuts[i].from) {
			// add video up to next cut.
			slices.push({
				from: sliceStart,
				to: cuts[i].from
			})
		}
		// resume after next cut.
		sliceStart = cuts[i].to;

	}

	// add final slice
	if (sliceStart < op.duration) {
		slices.push({ from: sliceStart, to: op.duration });
	}
	op.slices = slices;

}