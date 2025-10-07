export function secToHMS(totSec: number) {

	const sec = Math.floor(totSec) % 60;

	let mins = Math.floor(totSec / 60);
	const hrs = Math.floor(mins / 60);
	mins = mins % 60;


	return `${hrs.toString().padStart(2, '0')}-${mins.toString().padStart(2, '0')}-${sec.toString().padStart(2, '0')}`;

}

const padNum = (n: number) => {
	return n.toString().padStart(2, '0');
}

/**
 * 
 * @param time - time in seconds.
 */
export function formatTime(time: number) {

	const ms = Math.round(1000 * (time - Math.floor(time)));

	const sec = Math.floor(time) % 60;

	const hrs = Math.floor(time / 3600);

	const mins = Math.floor(time / 60) - 60 * hrs;

	return `${hrs > 0 ? hrs.toFixed(0) + ':' : ''}${padNum(mins)}:${padNum(sec)}:${padNum(ms)}`;
}