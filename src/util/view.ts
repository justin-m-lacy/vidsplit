
/**
 * Get the x-percent where mouse was clicked on track control.
 * @param e 
 * @returns 
 */
export function getClickPct(e: MouseEvent) {
	const rect = (e.target as HTMLDivElement).getBoundingClientRect();
	return (e.clientX - rect.left) / rect.width;
}

export function mediaReady(media?: HTMLMediaElement) {
	return media != null && media.readyState > 1;
}

export function minmax(v: number, min: number, max: number): number {
	return v < min ? min : (v > max ? max : v);
}