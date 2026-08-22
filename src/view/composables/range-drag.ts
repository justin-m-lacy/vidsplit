import { Timeline } from "@/view/composables/timeline";
import { useEventListener } from "@vueuse/core";

/**
 * check if html element matches reference target
 */
function matchTarget(el: HTMLElement, ref: ComponentPublicInstance | HTMLElement | undefined) {
	if (!ref) return false;
	if (ref instanceof HTMLElement) return ref == el;
	return ref.$el == el;
}


/**
 * Enables dragging the end points of a range selection.
 * @param media 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 * @param onDragged - callback when endpoint dragged.
 */
export function useRangeDrag({ tl, fromElm, toElm, onDragged, onStartDrag }: {
	tl: Timeline,
	fromElm: Ref<ComponentPublicInstance | HTMLElement | undefined>,
	toElm: Ref<ComponentPublicInstance | HTMLElement | undefined>,

	onStartDrag?: () => void,

	/**
	 * mediaPct - global percent of media duration where element was dragged.
	 */
	onDragged?: (el: HTMLElement, mediaPct: number, tl: Timeline) => void
}) {

	// current element being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);


	function startDrag(e: MouseEvent) {

		const el = e.currentTarget as HTMLElement;
		if (!matchTarget(el, fromElm.value) && !matchTarget(el, toElm.value)) return;

		curDragElm.value = el;
		onStartDrag?.();
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

	}

	function endDrag() {
		curDragElm.value = null;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	watch([fromElm, toElm], ([from, to]) => {

		if (from) {
			useEventListener(from instanceof HTMLElement ? from : from.$el, 'mousedown', startDrag, { capture: true });
		}

		if (to) {
			useEventListener(to instanceof HTMLElement ? to : to.$el, 'mousedown', startDrag, { capture: true });
		}

	}, { immediate: true });

	onUnmounted(() => {
		endDrag();
	});

}