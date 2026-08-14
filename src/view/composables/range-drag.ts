import { Timeline } from "@/view/composables/timeline";
import { useEventListener } from "@vueuse/core";

/**
 * Enables dragging the end points of a range selection.
 * @param media 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 * @param onDragged - callback when endpoint dragged.
 */
export function useRangeDrag({ tl, fromElm, toElm, onDragged }: {
	tl: Timeline,
	fromElm: Ref<HTMLElement | undefined>,
	toElm: Ref<HTMLElement | undefined>,

	/**
	 * mediaPct - percent of total media duration where element was dragged.
	 */
	onDragged?: (el: HTMLElement, mediaPct: number, tl: Timeline) => void
}) {

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

		onDragged?.(cur, tl.posToGlobalPct(e.clientX), tl);

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