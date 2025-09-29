import { SplitEdit } from "@/tools/split";
import type { MediaState } from "@/view/composables/media-state";
import { useEventListener } from "@vueuse/core";

/**
 * Enables dragging of end points of a slice operation.
 * @param media 
 * @param fromElm 
 * @param toElm 
 * @param barElm 
 */
export function useSplitDrags(
	media: MediaState,
	edit: SplitEdit,
	cutElms: Ref<HTMLElement[] | null>,
	barElm: Ref<HTMLElement | undefined>
) {

	// which elements already have event listeners.
	const hasEvents: Record<string, boolean> = Object.create(null);

	// element currently being dragged.
	const curDragElm = shallowRef<HTMLElement | null>(null);

	watch(cutElms, (elms, prev) => {

		console.log(`elements changed: ${prev?.length} -> ${elms?.length}`);
		if (!elms) return;

		for (let i = 0; i < elms.length; i++) {

			if (hasEvents[elms[i].id]) {
				console.log(`has events: ${i}`);
				continue;

			}
			hasEvents[elms[i].id] = true;
			useEventListener(elms[i], 'mousedown', startDrag, { capture: true });

		}

	});


	function startDrag(e: MouseEvent) {

		const targ = e.currentTarget as HTMLElement;

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

		const cut = edit.cuts.find(v => v.id == cur.id);
		if (!cut) {
			endDrag();
			return;
		}

		const bnds = barElm.value!.getBoundingClientRect();
		const pct = (e.clientX - bnds.left) / bnds.width;
		cut.pct = pct;

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