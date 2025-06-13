import { exec } from "child_process";
import { dialog, ipcMain, type App, type IpcMain } from "electron";
import { SliceData, type SetResolutionData } from '../shared/edits';
import { probeTypes } from "./ffmpeg/probe";
import { buildResolutionCmd } from "./ffmpeg/resolution";
import { buildSliceCmd } from "./ffmpeg/slice";
import { useExt } from "./files";

async function waitCommand(cmd: string, outpath: string) {
	return new Promise((res, rej) =>
		exec(cmd, (err) => {
			if (err) rej(err);
			else res(outpath);
		})
	);
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

	ipcMain.handle('save-slice', async (_, op: SliceData) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const inPath = (op.filePath);
		const fileInfo = probeTypes(inPath);
		const hasAudio = fileInfo.some(v => v.kind === 'audio');

		const outpath = useExt((dialogRes.filePath), inPath);

		const cmd = buildSliceCmd(op.slices, inPath, outpath, hasAudio);
		return waitCommand(cmd, outpath)

	});

}

/**
 * Change resolution operation.
 * @param ipcMain 
 * @param app 
 */
export function handleResolution(ipcMain: IpcMain, app: App) {


	ipcMain.handle('set-resolution', async (_, op: SetResolutionData) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const inPath = (op.filePath);
		const fileInfo = probeTypes(inPath);
		//const hasAudio = fileInfo.some(v => v.kind === 'audio');

		const outPath = useExt((dialogRes.filePath), inPath);

		const cmd = buildResolutionCmd(inPath, outPath, op.resolution);

		return waitCommand(cmd, outPath);

	});

}