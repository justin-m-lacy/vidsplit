import { exec } from "child_process";
import { dialog, ipcMain, type App, type IpcMain } from "electron";
import path from "path";
import { SliceOp } from '../shared/edits';
import { buildSliceCmd } from "./ffmpeg/slice";

const fixPath = (p: string) => {
	return p.replaceAll('\\', '/');
}

const useExt = (outPath: string, inPath: string) => {
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
		const outPath = useExt((dialogRes.filePath), inPath);

		const cmd = buildSliceCmd(op.slices, inPath, outPath);
		const result = await new Promise((res, rej) =>

			exec(cmd, (err) => {
				if (err) rej(err);
				else res(outPath);
			})
		);

		return result;

	});

}

