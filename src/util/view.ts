
/**
 * Get the 1-based x-percent where mouse was clicked on track control.
 * @param e 
 * @returns 
 */
export function getClickPctX(e: MouseEvent) {
	const rect = (e.target as HTMLElement).getBoundingClientRect();
	return minmax((e.clientX - rect.left) / rect.width, 0, 1);
}

/**
 * Get the 1-based y-percent where mouse was clicked on track control.
 * @param e 
 * @returns 
 */
export function getClickPctY(e: MouseEvent) {
	const rect = (e.target as HTMLElement).getBoundingClientRect();
	return minmax((rect.bottom - e.clientY) / rect.height, 0, 1);
}

export function minmax(v: number, min: number, max: number): number {
	return v < min ? min : (v > max ? max : v);
}