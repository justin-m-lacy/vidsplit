import { defineStore } from "pinia";
import { secToHMS } from '../../shared/time';

export const useSnapshot = defineStore('snapshots', () => {

	let canvas: HTMLCanvasElement | null = null;

	function getCanvas(): HTMLCanvasElement {
		return canvas ?? (canvas = document.createElement('canvas'));
	}

	function thumbnail(media: HTMLVideoElement) {

		const canvas = getCanvas();
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			console.warn(`failed to create context`);
			return;
		}
		canvas.width = 0.25 * media.clientWidth;
		canvas.height = 0.25 * media.clientHeight;

		ctx.drawImage(media, 0, 0, media.videoWidth, media.videoHeight,
			0, 0, canvas.width, canvas.height
		);

		return canvas.toDataURL('image/png');

	}

	let saveLink: string | null = null;

	const saveSnap = async (media: HTMLVideoElement, time: number) => {

		const file = await snap(media);
		if (!file) return;

		if (saveLink) URL.revokeObjectURL(saveLink);

		const a = document.createElement('a');
		//targ.type = 'text/json';
		a.download = a.title = secToHMS(time) + '.png';

		saveLink = URL.createObjectURL(file);
		a.href = saveLink;
		a.click();
		a.remove();

	}

	/**
	 * Snap image of full media.
	 * @param media 
	 */
	async function snap(media: HTMLVideoElement) {

		const canvas = getCanvas();
		const ctx = canvas.getContext('2d');

		if (!ctx) {
			console.warn(`failed to create context`);
			return;
		}
		canvas.width = media.videoWidth;
		canvas.height = media.videoHeight;

		ctx.drawImage(media, 0, 0, media.videoWidth, media.videoHeight,);

		return new Promise<Blob>((res, rej) => {

			canvas.toBlob((blob) => {

				if (blob) {
					res(blob);
				} else {
					rej();
				}
			}, 'image/png', 1)

		});

	}

	return {
		thumbnail,
		saveSnap,
		snap
	}

});