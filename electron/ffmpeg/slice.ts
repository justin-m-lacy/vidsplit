import { makeFilterArgs } from "electron/ffmpeg/filters";
import { quoteStr } from "../util/text";
import { spawnFFMpeg } from "./spawn";

type SliceRange = {
	// optional slice identifier
	id?: string,
	from: number,
	to: number
}

/**
 * select filter graph subtracks for output to file.
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
 * @param inId - base id of inputs. numbers will be appended for each slice.
 * inId = 'o', ids = o0v, o0a, o1v, o1a... etc.
 * @param audio - whether to include audio tracks in concat.
 * @param outId - name of output tracks
 * ('v', 'a' will be added automatically to video,audio track ids)
 * @returns 
 */
function makeConcatOp(inId: string, count: number, audio?: boolean, outId = 'out') {

	if (audio) {
		// collect input track names.
		const inputs = new Array(count).map((_, i) => `[${inId}${i}v][${inId}${i}a]`).join('');

		// concatenate into named output tracks.
		return `${inputs}concat=n=${count}:v=1:a=1[${outId}v][${outId}a]`;
	} else {

		// collect input track names.
		const inputs = new Array(count).map((_, i) => `[${inId}${i}v]`).join('');

		// concatenate into named output tracks.
		return `${inputs}concat=n=${count}[${outId}v]`;
	}
}

function makeSetFps(fps: number) {
	return `fps=${fps}`
}

/**
 * Create single trim slice from video.
 * @param s
 * @param vfilters - video trim arg is pushed onto this array.
 * if omitted, video is not cut.
 * @param afilters - autio trim arg is pushed to this this array.
 * if omitted, audio is not cut.
 * @returns 
 */
function makeTrimPart(s: SliceRange, vfilters?: string[], afilters?: string[]) {

	if (vfilters) {
		vfilters.push(`trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS`);
	}
	if (afilters) {
		afilters.push(`atrim=start=${s.from}:end=${s.to},asetpts=PTS-STARTPTS`);
	}

}

/**
 * Make all input slices relative to the earliest time slice
 * to optimize encoding.
 * Input can then be restricted to the total used time range,
 * instead of processing the entire media.
 * @param slices
 * @returns the time range of the original media file
 * that contains all the slices.
 */
function optimizeCuts(slices: SliceRange[]) {

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

/**
 * 
 * @param slice 
 * @param inUrl 
 * @param outUrl 
 * @param progress - progress callback.
 * @returns 
 */
export async function saveSimpleSlice(slice: SliceRange,
	inUrl: string,
	outUrl: string,
	progress?: (cur: number, tot: number) => void
) {

	const args: string[] = ['-y -loglevel error'];
	if (progress) args.push('-progress pipe:1');

	args.push('-ss', `${slice.from}`, '-to', `${slice.to}`);
	args.push(`-i ${quoteStr(inUrl)}`);

	//ffmpeg -ss 1:00 -i "video.mp4" -to 2:00 -c copy "cut.mp4"
	args.push('-c copy', '-avoid_negative_ts 1', quoteStr(outUrl));

	await spawnFFMpeg(args, progress, (slice.to - slice.from));

	return outUrl;

}

/**
 * Export for testing purposes.
 *  -ss seek start
 *  -to to duration
 */
export async function saveSlicesComplex(
	slices: SliceRange[],
	inUrl: string,
	outUrl: string,
	progress?: (cur: number, tot: number) => void,
	audio: boolean = true) {

	const args: string[] = ['-progress pipe:1', '-y -loglevel error'];

	const times = optimizeCuts(slices);

	args.push('-ss', `${times.from}`, '-to', `${times.to}`);
	args.push(`-i ${quoteStr(inUrl)}`);

	args.push('-filter_complex');

	// complete operations for each track: [inputTrack]filters,..[outTrack]
	// join with ';'
	const trackOps: string[] = [];

	slices.map((s, i) => {

		const vfilters: string[] = [];
		const afilters: string[] | undefined = audio ? [] : undefined;

		makeTrimPart(s, vfilters, afilters);
		makeFilterArgs(i, `o${i}`, trackOps, vfilters, afilters);

	}).join('');

	// add concatenate operation after trim.
	trackOps.push(makeConcatOp('o', slices.length, audio));

	args.push(trackOps.join(';'));
	args.push(mapOutput(outUrl, audio));

	return await spawnFFMpeg(args, progress, (times.to - times.from));


}