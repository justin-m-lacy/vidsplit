import Ffmpeg from "fluent-ffmpeg";
import type { MediaSlice } from "../../shared/edits";

/**
 * select filter graph subtracks to final output tracks.
 * @param outName 
 * @returns 
 */
function mapOutput(outName: string = 'out') {
	return ` -map [${outName}v] -map [${outName}a]`
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
		inputs += `[${i}v][${i}a]`;
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

	//return `trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;

	//separate A/V
	const vid = `[0:v]trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;
	const aud = `[0:a]atrim=start=${s.from}:end=${s.to},asetpts=PTS-STARTPTS[${outnum}a];`;
	return vid + aud;


}

export async function sliceMedia(inUrl: string, slices: MediaSlice[], outUrl: string) {
	let filter = '';
	for (let i = 0; i < slices.length; i++) {
		filter += makeTrimPart(slices[i], i);
	}
	filter += makeConcat(slices.length);
	filter += mapOutput()

	return new Promise<any>((res, rej) => {

		//res(filter);

		Ffmpeg(inUrl).addOption('-y')
			//.complexFilter(filter)
			.complexFilter(filter)
			.on('end', () => {
				res(null);
			}).on('error', (error: Error) => {
				rej(error);
			}).output(outUrl);

	});

}

export async function buildSliceCmd(inUrl: string, slices: MediaSlice[], outUrl: string) {
	let filter = '';
	for (let i = 0; i < slices.length; i++) {
		filter += makeTrimPart(slices[i], i);
	}
	filter += makeConcat(slices.length);
	filter += mapOutput()

	return filter;

}