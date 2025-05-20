import { dialog, type IpcMain } from "electron";
import FFMpeg from 'fluent-ffmpeg';
import { SliceOp } from '../../shared/edits';

export function handleSlice(ipcMain: IpcMain,) {

	ipcMain.handle('save-slice', async (evt, op: SliceOp) => {

		const dialogRes = await dialog.showSaveDialog({ title: 'Save Output' });

		if (dialogRes.canceled) {
			return null;
		}

		const slices = op.slices;

		let filter = '';
		for (let i = 0; i < slices.length - 1; i++) {
			filter += makeTrimPart(slices[i], i);
		}
		filter += makeConcat(slices.length);

		return new Promise<void>((res, rej) => {

			const ffmpeg = FFMpeg(op.mediaUrl)
				.complexFilter(filter, ['outv', 'outa'])
				.output(dialogRes.filePath).on('end', () => {
					res();
				});

		});


	});

}


