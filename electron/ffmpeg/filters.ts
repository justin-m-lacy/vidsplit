export function makeColorCurveArgs(curve: string) {
	return `curves=${curve}`;
}


export function makeFilterArgs(inTrack: string | number, outTrack: string, vfilters?: string[], afilters?: string[]) {

	if (typeof inTrack == 'number') inTrack = `${inTrack}:`;

	let s = '';
	if (vfilters?.length) {
		s = `[${inTrack}v]${vfilters.join(',')}[${outTrack}v]`
	}
	if (afilters?.length) {
		s += `[${inTrack}a]${afilters.join(',')}[${outTrack}a]`;
	}

	return s;

}