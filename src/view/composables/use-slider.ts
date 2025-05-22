import { getClickPct, minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useSlider(
	thumbElm: MaybeRefOrGetter<HTMLElement | undefined>,
	barElm: MaybeRefOrGetter<HTMLElement | undefined>,
	percent: Ref<number>
) {

	const dragging = shallowRef<boolean>(false);

	useEventListener(barElm, 'click', (e: MouseEvent) => {

		if (e.target != e.currentTarget) return;
		percent.value = getClickPct(e);

	});

	/// SCRUB DRAGGING

	function startDrag(e: MouseEvent) {

		if (e.target != e.currentTarget) return;

		dragging.value = true;

		window.addEventListener('mousemove', onDrag);
		window.addEventListener('mouseup', endDrag);

	}

	function onDrag(e: MouseEvent) {

		const bnds = toValue(barElm)?.getBoundingClientRect();
		if (!bnds) return;
		percent.value = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);
	}

	function endDrag() {

		dragging.value = false;

		window.removeEventListener('mousemove', onDrag);
		window.removeEventListener('mouseup', endDrag)
	}

	useEventListener(barElm, 'mousedown', startDrag,);
	useEventListener(thumbElm, 'mousedown', startDrag,);

	return {
		dragging,
		percent
	}

}