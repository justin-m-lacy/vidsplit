import { exec } from "child_process";
import { dialog, ipcMain, type App, type IpcMain } from "electron";
import { SliceOp } from '../shared/edits';
import { buildSliceCmd } from "./ffmpeg/slice";

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

		const outPath = dialogRes.filePath;
		const cmd = buildSliceCmd(op.slices, op.filePath, outPath);
		return new Promise((res, rej) =>

			exec(cmd, (err) => {
				if (err) rej(err);
				else res(outPath);
			})
		);

	});

}

