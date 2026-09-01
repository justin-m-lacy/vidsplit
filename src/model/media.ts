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

export type VCodec = 'libx264' | 'libx265' | 'libvpx-vp9' | 'libsvtav1';

export function createMediaInfo(media: HTMLMediaElement): TMediaInfo {

	return {
		id: window.crypto.randomUUID(),
		src: media.src,
		duration: media.duration,
		mime: 'video/*'
	}
}