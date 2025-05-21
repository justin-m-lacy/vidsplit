import { defineStore } from "pinia";

export const useScreenshots = defineStore('screenshots', () => {

	let canvas: HTMLCanvasElement | null = null;

	function getCanvas(): HTMLCanvasElement {
		return canvas ?? (canvas = document.createElement('canvas'));
	}

	function create(media: HTMLVideoElement) {

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

	return {
		create
	}

});