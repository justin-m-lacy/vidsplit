import type { MediaSlice } from "../../shared/edits";
import { quoteStr, waitSpawn } from "../util/files";

/**
 * select filter graph subtracks to final output tracks.
 * @param audio - include audio output.
 * @param outTrack -track names
 * @returns 
 */
function mapOutput(outFile: string, audio?: boolean, outTrack: string = 'out') {
	return `-map [${outTrack}v] ` + (audio ? `-map [${outTrack}a] ` : '') + quoteStr(outFile);
}

/**
 * number of parts being concatenated
 * @param slices 
 * @returns 
 */
function makeConcat(slices: MediaSlice[], audio?: boolean, outTrack = 'out') {

	if (audio) {
		// collect input track names.
		const inputs = slices.map((_, i) => `[${i}v][${i}a]`).join('');

		// concatenate into named output tracks.
		return `${inputs}concat=n=${slices.length}:v=1:a=1[${outTrack}v][${outTrack}a]`;
	} else {
		// collect input track names.
		const inputs = slices.map((_, i) => `[${i}v]`).join('');

		// concatenate into named output tracks.
		return `${inputs}concat=n=${slices.length}[${outTrack}v]`;
	}
}

const trimNum = (n: number) => {
	return (Math.round(n * 1000) / 1000).toFixed(2);
}
/**
 * Create single trim slice from video.
 * @param s 
 * @param outnum 
 * @returns 
 */
function makeTrimPart(s: MediaSlice, outnum: number, audio?: boolean) {

	const from = (s.from);
	const to = (s.to);

	///setpts=PTS=STARTPTS resets the frame count?
	/// optional format change:
	/// [0:v]trim=start=10.0:end=15.0,setpts=PTS-STARTPTS,format=yuv420p[0v];
	if (audio) {

		// trim input a/v track 0, write numbered output a/v tracks
		//separate A/V
		const vid = `[0:v]trim=start=${from}:end=${to},setpts=PTS-STARTPTS[${outnum}v];`;
		const aud = `[0:a]atrim=start=${from}:end=${to},asetpts=PTS-STARTPTS[${outnum}a];`;
		return vid + aud;

	} else {
		return `[0]trim=start=${from}:end=${to},setpts=PTS-STARTPTS[${outnum}v];`;
	}

}

/**
 * Make all input slices relative to the smallest time slice
 * to optimize encoding.
 * @param slices 
 */
function optimizeCuts(slices: MediaSlice[]) {

	let minTime: number = Number.MAX_SAFE_INTEGER;
	let maxTime: number = Number.MIN_SAFE_INTEGER;

	for (let i = 0; i < slices.length; i++) {

		if (slices[i].from < minTime) {
			minTime = slices[i].from;
		}
		if (slices[i].to > maxTime) {
			maxTime = slices[i].to;
		}
	}

	for (let i = 0; i < slices.length; i++) {
		slices[i].from -= minTime;
		slices[i].to -= minTime;
	}

	return {
		from: minTime,
		to: maxTime
	}
}

export async function trimMedia(slice: MediaSlice, inUrl: string, outUrl: string) {

	const args: string[] = ['-progress pipe:1', '-y'];

	args.push('-ss', `${slice.from}`, '-to', `${slice.to}`);
	args.push(`-i ${quoteStr(inUrl)}`);

	//ffmpeg -ss 1:00 -i "video.mp4" -to 2:00 -c copy "cut.mp4"
	args.push('-c copy', '-avoid_negative_ts 1', quoteStr(outUrl));

	await waitSpawn('ffmpeg', args);

	return outUrl;

}

// -ss seek start
// -t duration
// -to to duration
export function buildSliceCmd(
	slices: MediaSlice[],
	inUrl: string,
	outUrl: string,
	audio: boolean = true) {

	const args: string[] = ['-progress pipe:1', '-y'];

	const times = optimizeCuts(slices);

	args.push('-ss', `${times.from}`, '-to', `${times.to}`);
	args.push(`-i ${quoteStr(inUrl)}`);

	if (slices.length === 1) {
		//ffmpeg -ss 1:00 -i "video.mp4" -to 2:00 -c copy "cut.mp4"
		args.push('-c copy', '-avoid_negative_ts 1', quoteStr(outUrl))
		return {
			cmd: 'ffmpeg',
			args

		}

	}

	args.push('-filter_complex');

	let trims = slices.map((s, i) => makeTrimPart(s, i, audio)).join('');
	// add concatenate operation after trim.
	trims += makeConcat(slices, audio);

	args.push(trims);
	args.push(mapOutput(outUrl, audio));

	return {
		cmd: 'ffmpeg',
		args
	};

}