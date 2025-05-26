export function secToHMS(totSec: number) {

	const sec = Math.floor(totSec) % 60;

	let mins = Math.floor(totSec / 60);
	const hrs = Math.floor(mins / 60);
	mins = mins % 60;


	return `${hrs.toString().padStart(2, '0')}-${mins.toString().padStart(2, '0')}-${sec.toString().padStart(2, '0')}`;

}