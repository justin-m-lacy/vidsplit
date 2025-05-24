import { getClickPct, minmax } from "@/util/view";
import type { MediaState } from "@/view/composables/media-state";
import { useEventListener } from "@vueuse/core";

export function useScrubBar(
	state: MediaState,
	scrubRef: MaybeRefOrGetter<HTMLElement | undefined>,
	barRef: MaybeRefOrGetter<HTMLElement | undefined>
) {

	const dragging = shallowRef<boolean>(false);

	/**
	 * 100-based percent of play progress.
	 */
	const percent = shallowRef<number>(0);

	useEventListener(mediaRef, 'timeupdate', function (this: HTMLMediaElement) {

		if (dragging.value) return;
		else if (Number.isNaN(this.duration)) return;

		percent.value = 100 * (this.currentTime / this.duration);

	});

	/// SCRUB DRAGGING

	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;

		const pct = getClickPct(e);
		percent.value = 100 * pct;
		state.time = (pct * state.duration);

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const bnds = toValue(barRef)?.getBoundingClientRect();
		if (!bnds) return;

		const pct = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);
		percent.value = 100 * pct;

		state.time = (pct * state.duration);

	}

	function endDrag() {

		dragging.value = false;

		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(barRef, 'mousedown', startDrag,);
	useEventListener(scrubRef, 'mousedown', startDrag,);

	return {
		percent
	}

}