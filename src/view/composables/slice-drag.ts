import type { MediaState } from "@/view/composables/media-state";
import { useEventListener } from "@vueuse/core";

/**
 * Enables dragging of end points of a slice operation.
 * @param media 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 */
export function useSliceDrag(
	media: MediaState,
	fromElm: Ref<HTMLElement | undefined>,
	toElm: Ref<HTMLElement | undefined>,
	barElm: Ref<HTMLElement | undefined>
) {

	// element currently being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);

	function startDrag(e: MouseEvent) {

		const targ = e.target as HTMLElement;
		if (targ !== fromElm.value && targ !== toElm.value) {
			return;
		}

		curDragElm.value = e.target as HTMLElement;
		e.stopPropagation();

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const cur = curDragElm.value;
		if (cur == null) {
			endDrag();
			return;
		}

		const bnds = barElm.value!.getBoundingClientRect();
		const pct = (e.clientX - bnds.left) / bnds.width;

		if (cur == fromElm.value) {
			media.fromPct = pct;
		} else if (cur == toElm.value) {
			media.toPct = pct;
		}

	}

	function endDrag() {
		curDragElm.value = null;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(fromElm, 'mousedown', startDrag, { capture: true });
	useEventListener(toElm, 'mousedown', startDrag, { capture: true });


	onUnmounted(() => {
		endDrag();
	});

}