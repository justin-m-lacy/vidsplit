import type { MediaState } from "@/view/composables/media-state";
import { useEventListener } from "@vueuse/core";

export function useMediaView(state: MediaState) {

	/**
	 * scale of view timeline.
	 */
	const viewScale = shallowRef<number>(1);

	/**
	 * start percent (of total duration) of the viewable timeline.
	 * always a positive number.
	 */
	const viewOffset = shallowRef<number>(0);

	/**
	 * current play percent.
	 */
	const playPct = shallowRef<number>(0);

	/**
	 * Starting percent of total clip duration to actually play.
	 * ( Distinct from the portion being viewed.)
	 */
	const startPct = shallowRef<number>(0);

	/**
	 * End percent of total clip duration.
	 * that should be played.
	 */
	const endPct = shallowRef<number>(0);

	useEventListener(() => state.media, 'timeupdate', function (this: HTMLMediaElement) {

		if (Number.isNaN(this.duration) || this.duration === 0) {
			playPct.value = startPct.value;
			return;
		}

		const time = this.currentTime;
		const pct = this.currentTime / this.duration;

		if (dragging.value) return;
		else if (Number.isNaN(this.duration)) return;

		percent.value = 100 * (this.currentTime / this.duration);

	});

	/**
	 * Set the view scale while keeping the playhead at current position.
	 * @param amt 
	 */
	const setScale = (scale: number) => {

		if (scale < 1) scale = 1;

		// percent of clip currently visible = 1/scale
		// 2x scale = 1/2 visible.
		//const viewPct = (1 / viewScale.value);

		// relative position of playhead in within the view.
		// (playPct-pctOffset)/(1/viewScale)
		const delPct = (playPct.value - viewOffset.value) * viewScale.value;

		let newOffset = playPct.value - (delPct) / scale;
		if (newOffset < 0) newOffset = 0;
		else if (newOffset + (1 / scale) > 1) {
			newOffset = 1 - (1 / scale);
		}

		viewScale.value = scale;
		viewOffset.value = newOffset;

	}

	return {
		viewScale,
		viewOffset,
		setScale,
		startPct,
		endPct
	}

}