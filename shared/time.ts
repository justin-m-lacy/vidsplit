export function secToHMS(totSec: number) {

	const sec = Math.floor(totSec) % 60;

	let mins = Math.floor(totSec / 60);
	const hrs = Math.floor(mins / 60);
	mins = mins % 60;

	console.log(`t: ${hrs}:${mins}:${sec}`);

	return `${hrs}:${mins}:${sec}`;

}