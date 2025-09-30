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
	cutElms: Ref<HTMLElement[] | null>,
	curCut: Ref<MediaCut | null>
) {

	// which elements already have event listeners.
	const hasEvents: Record<string, boolean> = Object.create(null);

	// element currently being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);

	watch(edit.cuts, (cuts) => {

		nextTick(() => {
			const elms = cutElms.value;
			if (!elms) return;

			for (let i = 0; i < cuts.length; i++) {

				elms[i].id = cuts[i].id;
				if (hasEvents[cuts[i].id]) {
					//console.log(`skip has events: ${i} / ${cuts[i].id}`);
					continue;

				}
				hasEvents[cuts[i].id] = true;
				useEventListener(elms[i], 'mousedown', startDrag, { capture: true });

			}
		});
	});

	function startDrag(e: MouseEvent) {

		const targ = e.currentTarget as HTMLElement;

		const cut = edit.cuts.find(v => v.id == targ.id);
		if (!cut) return;

		curCut.value = cut;

		curDragElm.value = targ;
		e.stopPropagation();

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const elm = curDragElm.value;
		if (elm == null) {
			endDrag();
			return;
		}

		const cut = edit.cuts.find(v => v.id == elm.id);
		if (!cut) {
			endDrag();
			return;
		}
		cut.pct = tl.posToGlobalPct(e.clientX);

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