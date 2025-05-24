import { minmax } from "@/util/view";
import type { MediaState } from "@/view/composables/media-state";
import { useEventListener } from "@vueuse/core";

export function useScrubBar(
	state: MediaState,
	scrubRef: MaybeRefOrGetter<HTMLElement | undefined>,
	barRef: MaybeRefOrGetter<HTMLElement | undefined>
) {

	const dragging = shallowRef<boolean>(false);

	/**
	 * percent position of scrub on view bar.
	 */
	const scrubPct = shallowRef<number>(0);

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
		const delPct = (scrubPct.value - viewOffset.value) * viewScale.value;

		let newOffset = scrubPct.value - (delPct) / scale;
		if (newOffset < 0) newOffset = 0;
		else if (newOffset + (1 / scale) > 1) {
			newOffset = 1 - (1 / scale);
		}

		viewScale.value = scale;
		viewOffset.value = newOffset;

	}

	watch(() => state.time, (t) => {
		if (state.duration != 0) {
			scrubPct.value = (t / state.duration);
		} else {
			scrubPct.value = 0;
		}
	});

	/**
	 * Convert play position percent (out of total duration)
	 * into percent positon on scrub bar.
	 * @param totPct 
	 */
	function toBarPct(totPct: number) {
		return minmax((totPct - viewOffset.value) * viewScale.value, 0, 1);
	}

	/**
	 * Convert percent position on play bar to global play percent.
	 * @param viewPct 
	 * @returns 
	 */
	function toPlayPct(viewPct: number) {
		return minmax(viewOffset.value + viewPct / viewScale.value, 0, 1);
	}

	/**
	 * Get view-percent position on scrub-bar.
	 * @param e 
	 * @returns 
	 */
	function getBarPct(clientX: number) {
		const bnds = toValue(barRef)?.getBoundingClientRect();
		if (!bnds) return 0;
		return minmax((clientX - bnds.left) / bnds.width, 0, 1);
	}

	/// SCRUB DRAGGING
	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;

		scrubPct.value = getBarPct(e.clientX);
		state.time = toPlayPct(scrubPct.value);

		//dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		scrubPct.value = getBarPct(e.clientX);
		state.time = toPlayPct(scrubPct.value);

	}

	function endDrag() {

		//dragging.value = false;

		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(barRef, 'mousedown', startDrag,);
	useEventListener(scrubRef, 'mousedown', startDrag,);

	return {
		scrubPct,
		viewScale,
		viewOffset,
		toBarPct,
		toPlayPct,
		setScale
	}

}