export function makeColorCurve(curve: string) {
	return `curves=${curve}`;
}


/**
 * Create args to apply a set of filters to a video/audio track pair.
 * @param inTrack base name of input tracks.
 * 'v' and 'a' are automatically added to names of all tracks.
 * If inTrack is a number, it represents a base numbered track.
 * @param outTrack - name of output tracks ('v' and 'a' are automatically added at end.)
 * @param outArgs - output array to push the filter arguments.
 * @param vfilters - filter args applied to video.
 * @param afilters - filter args applied to audio.
 */
export function makeFilterArgs(
	inTrack: string | number,
	outTrack: string,
	outArgs: string[],
	vfilters?: string[],
	afilters?: string[]) {

	if (typeof inTrack == 'number') inTrack = `${inTrack}:`;

	if (vfilters?.length) {
		outArgs.push(`[${inTrack}v]${vfilters.join(',')}[${outTrack}v]`);
	}
	if (afilters?.length) {
		outArgs.push(`[${inTrack}a]${afilters.join(',')}[${outTrack}a]`);
	}

}