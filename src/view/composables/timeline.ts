import { minmax } from "@/util/view";
import type { MediaState } from "@/view/composables/media-state";
import { useDebounceFn, useEventListener } from "@vueuse/core";

export type Timeline = ReturnType<typeof useTimeline>;

/**
 * Enable select current play state on timeline.
 * @param media 
 * @param scrubElm 
 * @param barRef 
 * @returns 
 */
export function useTimeline(
	media: MediaState,
	scrubElm: MaybeRefOrGetter<HTMLElement | undefined>,
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

		const playPct = media.time / media.duration;
		let newOffset = playPct - scrubPct.value * pct;

		if (newOffset < 0) newOffset = 0;
		else if (newOffset + pct > 1) {
			newOffset = 1 - (pct);
		}

		viewOffset.value = newOffset;

	}

	watch(() => media.time, (t) => {
		if (dragging.value) return;
		scrubPct.value = media.duration > 0 ? toBarPct(t / media.duration) : 0;
	});

	const endZooming = useDebounceFn(() => zooming.value = false, 500);

	useEventListener('wheel', (e: WheelEvent) => {

		setViewSize(viewScale.value - e.deltaY / 1000);
		zooming.value = true;
		endZooming();

	});

	/**
	 * Convert scaled % position on scrub bar to global media percent.
	 * @param barPct 
	 * @returns 
	 */
	const toGlobalPct = (barPct: number) => {
		return viewOffset.value + barPct * viewScale.value;
	}

	/**
	 * Convert % of total media duration
	 * to local % positon on scrub bar.
	 * @param totPct 
	 */
	const toBarPct = (totPct: number) => {
		return minmax((totPct - viewOffset.value) / viewScale.value, 0, 1);
	}

	/**
	 * Convert viewport x-position to percent of total media duration.
	 * @param clientX 
	 */
	function posToGlobalPct(clientX: number) {
		return toGlobalPct(posToBarPct(clientX));
	}

	/**
	 * Convert viewport x-position to percent of total play bar.
	 * @param e 
	 * @returns 
	 */
	function posToBarPct(clientX: number) {
		const bnds = toValue(barRef)?.getBoundingClientRect();
		return bnds ? minmax((clientX - bnds.left) / bnds.width, 0, 1) : 0;
	}

	/// SCRUB DRAGGING
	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;
		e.stopPropagation();
		if (!media.ready) return;

		scrubPct.value = posToBarPct(e.clientX);
		media.time = media.duration * toGlobalPct(scrubPct.value);

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		scrubPct.value = posToBarPct(e.clientX);
		media.time = media.duration * toGlobalPct(scrubPct.value);

	}

	function endDrag() {

		dragging.value = false;

		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(barRef, 'mousedown', startDrag,);
	useEventListener(scrubElm, 'mousedown', startDrag,);

	return {
		media,
		scrubPct,
		viewScale,
		viewOffset,
		toBarPct,
		posToGlobalPct,
		zooming,
		dragging,
		setViewSize
	}

}