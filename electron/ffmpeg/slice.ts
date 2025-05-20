import type { MediaSlice } from "../../shared/edits";

/**
 * select filter graph subtracks to final output tracks.
 * @param audio - include audio output.
 * @param outTrack -track names
 * @returns 
 */
function mapOutput(outFile: string, audio?: boolean, outTrack: string = 'out') {
	return ` -map [${outTrack}v]` + (audio ? `[${outTrack}a]` : '') + ` ${outFile}`;
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

/**
 * Create single trim slice from video.
 * @param s 
 * @param outnum 
 * @returns 
 */
function makeTrimPart(s: MediaSlice, outnum: number, audio?: boolean) {

	///setpts=PTS=STARTPTS resets the frame count?
	/// optional format change:
	/// [0:v]trim=start=10.0:end=15.0,setpts=PTS-STARTPTS,format=yuv420p[0v];
	if (audio) {

		// trim input a/v track 0, write numbered output a/v tracks
		//separate A/V
		const vid = `[0:v]trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;
		const aud = `[0:a]atrim=start=${s.from}:end=${s.to},asetpts=PTS-STARTPTS[${outnum}a];`;
		return vid + aud;

	} else {
		return `[0]trim=start=${s.from}:end=${s.to},setpts=PTS-STARTPTS[${outnum}v];`;
	}

}


export function makeFilterInput(inUrl) {
	return `ffmpeg -y -i ${inUrl} -filter_complex `
}

export async function buildSliceCmd(
	slices: MediaSlice[],
	inUrl: string,
	outUrl: string,
	audio: boolean = true) {

	let filter = makeFilterInput(inUrl);

	filter += slices.map((s, i) => makeTrimPart(s, i, audio)).join('');
	filter += makeConcat(slices, audio);
	filter += mapOutput(outUrl, audio);

	return filter;

}