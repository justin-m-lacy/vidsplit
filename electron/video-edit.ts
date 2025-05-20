import { dialog, type IpcMain } from "electron";
import FFMpeg from 'fluent-ffmpeg';
import { MediaSlice, SliceOp } from '../shared/edits';


/**
 * number of parts being concatenated
 * @param parts 
 * @returns 
 */
function makeConcat(parts: number) {

	let inputs = '';
	for (let i = 0; i < parts; i++) {
		inputs = `[${i}v][${i}a]`;
	}

	return `${inputs}concat=n=${parts}:v=1:a=1[outv][outa]`;
}

function makeTrimPart(s: MediaSlice, outnum: number = 0) {

	const vid = `[0v]trim=start=${s.from}:end=${s.to},setpts=PTS=STARTPTS,${outnum}v;`;
	const aud = `[0a]trim=start=${s.from}:end=${s.to},setpts=PTS=STARTPTS,${outnum}a;`;
	return vid + '\n' + aud;

}

export function handleSlice(ipcMain: IpcMain,) {

	ipcMain.handle('save-slice', async (evt, op: SliceOp) => {

		const res = await dialog.showSaveDialog({ title: 'Save Output' });

		if (res.canceled) {
			return null;
		}

		const ffmpeg = FFMpeg(op.mediaUrl);
		ffmpeg.output(res.filePath).on('end', () => {

		});

	});

}

