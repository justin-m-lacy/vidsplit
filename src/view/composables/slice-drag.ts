import { minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useSliceDrag(
	left: Ref<HTMLElement>,
	right: Ref<HTMLElement>,
	parent: Ref<HTMLElement>
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

		let x = e.clientX;

		if (cur == left.value) {

			const maxX = right.value.getBoundingClientRect().left;
			if (x > maxX) x = maxX;

		} else if (cur == right.value) {

			const minX = left.value.getBoundingClientRect().left;
			if (x < minX) x = minX;

		}

		const bnds = parent.value.getBoundingClientRect();
		const offsetX = minmax((x - bnds.left) / bnds.width, 0, 1);

		cur.style.left = `${100 * offsetX}%`;

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