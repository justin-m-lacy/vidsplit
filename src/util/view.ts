
/**
 * Get the 1-based x-percent where mouse was clicked on track control.
 * @param e 
 * @returns 
 */
export function getClickPct(e: MouseEvent) {
	const rect = (e.target as HTMLDivElement).getBoundingClientRect();
	return minmax((e.clientX - rect.left) / rect.width, 0, 1);
}

export function mediaReady(media?: HTMLMediaElement): media is HTMLMediaElement {
	return media != null && media.duration > 0 && media.readyState > 1;
}

export function minmax(v: number, min: number, max: number): number {
	return v < min ? min : (v > max ? max : v);
}