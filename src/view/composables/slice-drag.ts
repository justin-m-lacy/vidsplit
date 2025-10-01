import { Timeline } from "@/view/composables/timeline";
import { useEventListener } from "@vueuse/core";

/**
 * Enables dragging of end points of a slice operation.
 * @param media 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 */
export function useSliceDrag(
	tl: Timeline,
	fromElm: Ref<HTMLElement | undefined>,
	toElm: Ref<HTMLElement | undefined>
) {

	// element currently being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);

	function startDrag(e: MouseEvent) {

		const targ = e.currentTarget as HTMLElement;
		if (targ !== fromElm.value && targ !== toElm.value) {
			return;
		}

		curDragElm.value = targ;
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

		if (cur == fromElm.value) {
			tl.media.fromPct = tl.posToGlobalPct(e.clientX);
		} else if (cur == toElm.value) {
			tl.media.toPct = tl.posToGlobalPct(e.clientX);
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