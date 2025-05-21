import type { TEditTool, TMediaEdit } from "@/model/edit";
import type { MediaState } from "@/view/composables/media-state";
import { MediaSlice } from '../../shared/edits';

export type SliceEdit = TMediaEdit & ReturnType<typeof makeSliceEdit>;

export function IsSliceEdit(edit?: TMediaEdit): edit is SliceEdit {
	return edit != null && edit.toolId === SliceTool.id;
}

// removed from tool to avoid circular typescript ref.
const SliceId = Symbol('slice');

function makeSliceEdit(media: MediaState) {

	const slices = shallowRef<MediaSlice[]>([]);

	// current left slice position.
	const fromPct = shallowRef<number>(0);

	// current right slice position.
	const toPct = shallowRef<number>(1);

	/**
	 * Add media slice from current left/right percents.
	 */
	const addSlice = (screenshot?: string) => {

		slices.value.push({
			id: window.crypto.randomUUID(),
			from: fromPct.value,
			to: toPct.value,
			screenshot: screenshot
		});

		triggerRef(slices);

	}

	const removeSlice = (slice: MediaSlice) => {

		const id = slice.id;
		slices.value = slices.value.filter(s => s.id !== id);

	}

	/// apply operation.
	const apply = async () => {

	}

	return {
		id: window.crypto.randomUUID(),
		toolId: SliceId,
		apply,
		media,
		fromPct,
		toPct,
		get slices() { return slices.value },
		addSlice,
		removeSlice
	};

}

export const SliceTool: TEditTool<SliceEdit> = {

	id: SliceId,

	canUse: true,

	beginEdit: makeSliceEdit

}