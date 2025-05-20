import { dialog, type IpcMain } from "electron";
import FFMpeg from 'fluent-ffmpeg';
import { MediaSlice, SliceOp } from '../shared/edits';


/**
 * select filter graph subtracks to final output tracks.
 * @param outTrack 
 * @returns 
 */
function mapOutput(outTrack: string = 'out') {
	return `-map [${outTrack}v] -map [${outTrack}a]`
}

/**
 * number of parts being concatenated
 * @param parts 
 * @returns 
 */
function makeConcat(parts: number, outname = 'out') {

	// collect input track names.
	let inputs = '';
	for (let i = 0; i < parts; i++) {
		inputs = `[${i}v][${i}a]`;
	}

	// concatenate into named output tracks.
	return `${inputs}concat=n=${parts}:v=1:a=1[${outname}v][${outname}a]`;
}

/**
 * Create single trim slice from video.
 * @param s 
 * @param outnum 
 * @returns 
 */
function makeTrimPart(s: MediaSlice, outnum: number = 0) {

	///setpts=PTS=STARTPTS resets the frame count?
	/// optional format change:
	/// [0:v]trim=start=10.0:end=15.0,setpts=PTS-STARTPTS,format=yuv420p[0v];
	// trim input a/v track 0, write numbered output a/v tracks
	const vid = `[0v]trim=start=${s.from}:end=${s.to},setpts=PTS=STARTPTS,${outnum}v;`;
	const aud = `[0a]trim=start=${s.from}:end=${s.to},setpts=PTS=STARTPTS,${outnum}a;`;
	return vid + aud;

}

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

