import { getClickPctY, minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

/**
 * Select percent by dragging along a bar control.
 * @param barElm 
 * @param percent 
 * @param vertical 
 * @returns 
 */
export function useBarSlider(
	barElm: MaybeRefOrGetter<HTMLElement | undefined>,
	percent: Ref<number>,
	vertical: boolean = false
) {

	const dragging = shallowRef<boolean>(false);

	useEventListener(barElm, 'click', (e: MouseEvent) => {

		if (e.target != e.currentTarget) return;
		percent.value = getClickPctY(e);
	});

	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const bnds = toValue(barElm)?.getBoundingClientRect();
		if (!bnds) return;
		percent.value = vertical ?
			minmax(1 - (e.clientY - bnds.top) / bnds.height, 0, 1)
			: minmax((e.clientX - bnds.left) / bnds.width, 0, 1);
	}

	function endDrag() {

		dragging.value = false;

		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(barElm, 'mousedown', startDrag,);

	return {
		dragging,
		percent
	}

}