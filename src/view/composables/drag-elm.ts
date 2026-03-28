import { useEventListener } from '@vueuse/core';

export function useDrag<T extends object>(
	onMove: (evt: MouseEvent, el: HTMLElement, data: T | undefined) => void
) {

	const dragEl = shallowRef<HTMLElement>();
	const dragData = shallowRef<T>();

	const dragging = shallowRef(false);

	useEventListener('mouseup', endDrag);
	useEventListener('dragend', endDrag);

	function startDrag(el: HTMLElement, data: T) {

		dragEl.value = el;
		dragData.value = data;

		if (!dragging.value) {
			dragging.value = true;
			window.addEventListener('drag', onDrag);
		}

	}

	function endDrag() {
		dragEl.value = undefined;
		dragData.value = undefined;
		if (dragging.value) {
			dragging.value = false;
			window.removeEventListener('drag', onDrag);
		}
	}


	const onDrag = (evt: MouseEvent) => {
		dragging.value = true;
		if (dragEl.value) {
			onMove(evt, dragEl.value, dragData.value);
		}
	}

	onUnmounted(endDrag);

	return {

		startDrag,
		endDrag,
		get dragging() { return dragEl.value != undefined && dragging.value },
		get dragEl() { return dragEl.value },
		get dragData() { return dragData.value }
	}

}
