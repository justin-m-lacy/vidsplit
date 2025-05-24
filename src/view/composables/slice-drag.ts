import type { SliceEdit } from "@/tools/slice";
import { minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";

export function useSliceDrag(
	edit: SliceEdit,
	fromElm: Ref<HTMLElement | undefined>,
	toElm: Ref<HTMLElement | undefined>,
	barElm: Ref<HTMLElement | undefined>
) {

	const curDragElm = shallowRef<HTMLElement | null>(null);

	useEventListener(edit.media.media!, 'timeupdate', function (this: HTMLMediaElement) {

		// nextTick() - sometimes video time tracks back to previous value.
		if (this.currentTime < edit.fromPct.value * this.duration) {
			forceTime(this, edit.fromPct.value * this.duration);
		} else if (this.currentTime > edit.toPct.value * this.duration) {

			if (this.loop) {
				forceTime(this, edit.fromPct.value * this.duration);
			} else {
				this.pause();
				forceTime(this, edit.toPct.value * this.duration);
			}
		}

	});


	function startDrag(e: MouseEvent) {

		const targ = e.target as HTMLElement;
		if (targ !== fromElm.value && targ !== toElm.value) {
			return;
		}

		curDragElm.value = e.target as HTMLElement;
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

		const bnds = barElm.value!.getBoundingClientRect();
		const pct = minmax((e.clientX - bnds.left) / bnds.width, 0, 1);

		if (cur == fromElm.value) {
			edit.fromPct.value = Math.min(pct, edit.toPct.value);
		} else if (cur == toElm.value) {
			edit.toPct.value = Math.max(pct, edit.fromPct.value);
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