import { getClickPct, minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useScrubBar(
	mediaRef: MaybeRefOrGetter<HTMLMediaElement | undefined>,
	scrubRef: MaybeRefOrGetter<HTMLElement | undefined>,
	barRef: MaybeRefOrGetter<HTMLElement | undefined>
) {

	const dragging = shallowRef<boolean>(false);

	useEventListener(barRef, 'click', (e: MouseEvent) => {

		const media = toValue(mediaRef);
		if (!media) return;
		if (Number.isNaN(media.duration)) return;

		const pct = getClickPct(e);
		media.currentTime = (pct * media.duration);


	});

	useEventListener(mediaRef, 'timeupdate', function (this: HTMLMediaElement) {

		if (this) {
			this.style.left = `${100 * this.currentTime / this.duration}%`;
		}
	});

	/// SCRUB DRAGGING

	function startDrag(e: MouseEvent) {

		dragging.value = true;
		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const bnds = toValue(barRef)?.getBoundingClientRect();

		if (bnds) {
			const pct = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);
			const media = toValue(mediaRef);

			if (!media) return;
			if (Number.isNaN(media.duration)) return;

			media.currentTime = (pct * media.duration);
		}

	}

	function endDrag() {
		dragging.value = false;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(scrubRef, 'mousedown', startDrag, {});

	return {

	}

}