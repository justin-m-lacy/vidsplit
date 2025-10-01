import { MediaCut, SplitEdit } from "@/tools/split";
import { Timeline } from "@/view/composables/timeline";
import { useEventListener } from "@vueuse/core";

/**
 * Enables dragging of end points of a slice operation.
 * @param tl 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 */
export function useSplitDrags(
	tl: Timeline,
	edit: SplitEdit,
	cutElms: Ref<ComponentPublicInstance[] | null>,
	curCut: Ref<MediaCut | null>
) {

	// which elements already have event listeners.
	const hasEvents: Record<string, boolean> = Object.create(null);

	// element currently being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);

	/**
	 * can't watch elements because watcher isn't deep.
	 */
	watch(edit.cuts, (_) => {

		// wait tick for elements to mount.
		nextTick(() => {
			const elms = cutElms.value;
			if (!elms) return;

			for (let i = 0; i < elms.length; i++) {

				const el = elms[i].$el;
				if (!el || hasEvents[el.id]) continue;
				hasEvents[el.id] = true;
				useEventListener(el, 'mousedown', startDrag, { capture: true });

			}
		});
	});

	function startDrag(e: MouseEvent) {

		const targ = e.currentTarget as HTMLElement;

		const cut = edit.cuts[targ.id];
		if (!cut) return;

		curCut.value = cut;

		curDragElm.value = targ;
		e.stopPropagation();

		tl.media.time = cut.pct * tl.media.duration;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const elm = curDragElm.value;
		if (elm == null) {
			endDrag();
			return;
		}

		const cut = edit.cuts[elm.id];
		if (!cut) {
			endDrag();
			return;
		}
		cut.pct = tl.posToGlobalPct(e.clientX);
		tl.media.time = cut.pct * tl.media.duration;

	}

	function endDrag() {
		curDragElm.value = null;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	onUnmounted(() => {
		endDrag();
	});

}