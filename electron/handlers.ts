import { exec } from "child_process";
import { dialog, type IpcMain } from "electron";
import { SliceOp } from '../shared/edits';
import { buildSliceCmd } from "./ffmpeg/slice";

export function handleSlice(ipcMain: IpcMain,) {

	ipcMain.handle('save-slice', async (_, op: SliceOp) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });
		if (dialogRes.canceled) {
			return null;
		}

		const outPath = dialogRes.filePath;
		const cmd = buildSliceCmd(op.slices, op.mediaUrl, outPath);
		return new Promise((res, rej) =>

			exec(cmd, (err) => {
				if (err) rej(err);
				else res(outPath);
			})
		);

	});

}

