import { getClickPct, minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useScrubBar(
	mediaRef: MaybeRefOrGetter<HTMLMediaElement | undefined>,
	scrubRef: MaybeRefOrGetter<HTMLElement | undefined>,
	barRef: MaybeRefOrGetter<HTMLElement | undefined>
) {

	const dragging = shallowRef<boolean>(false);

	/**
	 * 100-based percent of play progress.
	 */
	const percent = shallowRef<number>(0);

	useEventListener(barRef, 'click', (e: MouseEvent) => {

		if (e.target != e.currentTarget) return;

		const media = toValue(mediaRef);
		if (!media) return;
		if (Number.isNaN(media.duration)) return;
		const pct = getClickPct(e);
		percent.value = 100 * pct;

		media.currentTime = (pct * media.duration);

	});

	useEventListener(mediaRef, 'timeupdate', function (this: HTMLMediaElement) {

		if (dragging.value) return;
		else if (Number.isNaN(this.duration)) return;

		percent.value = 100 * (this.currentTime / this.duration);

	});

	/// SCRUB DRAGGING

	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const bnds = toValue(barRef)?.getBoundingClientRect();
		if (!bnds) return;

		const pct = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);
		percent.value = 100 * pct;

		const media = toValue(mediaRef);
		if (!media) return;
		if (Number.isNaN(media.duration)) return;

		media.currentTime = (pct * media.duration);

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