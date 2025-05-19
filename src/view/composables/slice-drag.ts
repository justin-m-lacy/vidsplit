import type { SliceEdit } from "@/tools/slice";
import { minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useSliceDrag(
	edit: SliceEdit,
	left: Ref<HTMLElement | undefined>,
	right: Ref<HTMLElement | undefined>,
	parent: Ref<HTMLElement | undefined>
) {

	const curDrag = shallowRef<HTMLElement | null>(null);

	function startDrag(e: MouseEvent) {

		const targ = e.target as HTMLElement;
		if (targ === left.value || targ === right.value) {
			curDrag.value = e.target as HTMLElement;
		} else {
			console.log(`unknowing drag targ: ${targ.id}`);
			return;
		}

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const cur = curDrag.value;
		if (cur == null) {
			endDrag();
			return;
		}

		const bnds = parent.value!.getBoundingClientRect();
		const pct = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);

		if (cur == left.value) {
			edit.leftPct.value = Math.min(pct, edit.rightPct.value);
		} else if (cur == right.value) {
			edit.rightPct.value = Math.max(pct, edit.leftPct.value);
		}


	}

	function endDrag() {
		curDrag.value = null;
		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(left, 'mousedown', startDrag, {});
	useEventListener(right, 'mousedown', startDrag, {});


	onUnmounted(() => {
		endDrag();
	});

}