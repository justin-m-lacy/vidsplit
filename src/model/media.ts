export type TrackRange = {
	start: number,
	end: number
}

export type TrackPoint = {
	id: string,
	at: number
}

export type TMediaInfo = {

	id: string;

	src: string;
	duration: number;
	mime?: string;

}

export function createScrubAt(media: TMediaInfo, at: number): TrackPoint {
	if (at < 0) at = 0;
	else if (at > media.duration) at = media.duration;

	return { id: window.crypto.randomUUID(), at };
}

export function createScrubPct(media: TMediaInfo, pct: number): TrackPoint {

	if (pct > 1) pct = 1;
	else if (pct < 0) pct = 0;
	return { id: window.crypto.randomUUID(), at: pct * media.duration };

}

export function createMediaInfo(media: HTMLMediaElement): TMediaInfo {

	return {
		id: window.crypto.randomUUID(),
		src: media.src,
		duration: media.duration,
		mime: 'video/*'
	}
}