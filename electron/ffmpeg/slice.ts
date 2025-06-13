import type { MediaSlice, TResolution } from "../../shared/edits";
import { quoteStr } from "../files";

/**
 * select filter graph subtracks to final output tracks.
 * @param audio - include audio output.
 * @param outTrackId -track names
 * @returns 
 */
function mapOutput(outFile: string, audio?: boolean, outTrackId: string = 'out') {
	return ` -map [${outTrackId}v] ` + (audio ? `-map [${outTrackId}a] ` : '') + quoteStr(outFile);
}

/**
 * Add option to set the resolution of a video track.
 * @param res 
 * @param inTrackId - named video track in filter graph.
 * @param outTrackId - name of scaled video track.
 */
function setScale(res: TResolution, inTrackId: string, outTrackId: string,) {
	return `[${inTrackId}]scale=${res.width}:${res.height}[${outTrackId}];`
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


export function makeFilterCmd(inUrl: string) {
	return `ffmpeg -y -i ${quoteStr(inUrl)} -filter_complex `
}

/**
 * 
 * @param slices 
 * @param inUrl 
 * @param outUrl 
 * @param audio 
 * @param scale optional rescale.
 * @returns 
 */
export function buildSliceCmd(
	slices: MediaSlice[],
	inUrl: string,
	outUrl: string,
	audio: boolean = true,
	scale?: TResolution) {

	let filter = makeFilterCmd(inUrl);
	let outtrack = 'out';

	filter += slices.map((s, i) => makeTrimPart(s, i, audio)).join('');
	filter += makeConcat(slices, audio, outtrack);

	if (scale) {
		filter += ' ' + setScale(scale, outtrack, 'scale') + ' ';
		// export track changes to 'scale'
		outtrack = 'scale';
	}

	filter += mapOutput(outUrl, audio, outtrack);

	return filter;

}