import { minmax } from "@/util/view";
import type { MediaState } from "@/view/composables/media-state";
import { useDebounceFn, useEventListener } from "@vueuse/core";

export type Timeline = ReturnType<typeof useTimeline>;

export function useTimeline(
	state: MediaState,
	scrubRef: MaybeRefOrGetter<HTMLElement | undefined>,
	barRef: MaybeRefOrGetter<HTMLElement | undefined>
) {

	const zooming = shallowRef<boolean>(false);
	const dragging = shallowRef<boolean>(false);

	/**
	 * percent position of scrub across full view bar. (no scaling)
	 */
	const scrubPct = shallowRef<number>(0);

	/**
	 * scale of view timeline, e.g.
	 * percent of total clip represented by the play bar.
	 */
	const viewScale = shallowRef<number>(1);

	/**
	 * start percent (out of total duration) of the viewable timeline.
	 * always a positive number.
	 */
	const viewOffset = shallowRef<number>(0);

	/**
	 * Set the view scale while keeping the playhead at current position.
	 * @param pct - percent of total clip visible.
	 */
	const setViewSize = (pct: number) => {

		if (pct < 0.05) pct = 0.05;
		else if (pct > 1) pct = 1;

		viewScale.value = pct;

		const playPct = state.time / state.duration;
		let newOffset = playPct - scrubPct.value * pct;

		if (newOffset < 0) newOffset = 0;
		else if (newOffset + pct > 1) {
			newOffset = 1 - (pct);
		}


		viewOffset.value = newOffset;

	}

	watch(() => state.time, (t) => {
		if (dragging.value) return;
		if (state.duration != 0) {
			scrubPct.value = (t / state.duration);
		} else {
			scrubPct.value = 0;
		}
	});

	const endZooming = useDebounceFn(() => {
		zooming.value = false;
	}, 500);

	useEventListener('wheel', (e: WheelEvent) => {

		setViewSize(viewScale.value - e.deltaY / 1000);
		zooming.value = true;
		endZooming();

	});

	/**
	 * Convert play position percent out of total duration
	 * into percent positon on scrub bar.
	 * @param totPct 
	 */
	const toBarPct = (totPct: number) => {
		return minmax((totPct - viewOffset.value) / viewScale.value, 0, 1);
	}

	/**
	 * Convert percent position on play bar to global play percent.
	 * @param barPct 
	 * @returns 
	 */
	const toPlayPct = (barPct: number) => {
		return viewOffset.value + barPct * viewScale.value;
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
		state.time = state.duration * toPlayPct(scrubPct.value);

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		scrubPct.value = getBarPct(e.clientX);
		state.time = state.duration * toPlayPct(scrubPct.value);

	}

	function endDrag() {

		dragging.value = false;

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
		zooming,
		dragging,
		setViewSize
	}

}