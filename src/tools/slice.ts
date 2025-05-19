import type { TEditTool, TMediaEdit } from "@/model/edit";
import { TMediaInfo } from '../model/media';

export type SliceEdit = TMediaEdit & ReturnType<typeof createSliceEdit>;

export type MediaSlice = {
	id: string,
	left: number,
	right: number
}
export function IsSliceEdit(edit?: TMediaEdit): edit is SliceEdit {
	return edit != null && edit.tool === 'slice';
}

function createSliceEdit(media: TMediaInfo) {

	const slices = shallowRef<MediaSlice[]>([]);

	// current left slice position.
	const leftPct = shallowRef<number>(0);

	// current right slice position.
	const rightPct = shallowRef<number>(1);

	/**
	 * Add media slice from current left/right percents.
	 */
	const addSlice = () => {

		slices.value.push({
			id: window.crypto.randomUUID(),
			left: leftPct.value,
			right: rightPct.value,
		});

		triggerRef(slices);

	}

	const removeSlice = (slice: MediaSlice) => {

		const id = slice.id;
		slices.value = slices.value.filter(s => s.id !== id);

	}

	return {
		id: window.crypto.randomUUID(),
		tool: 'slice',
		media,
		leftPct,
		rightPct,
		slices,
		addSlice,
		removeSlice
	};

}

export const SliceTool: TEditTool<SliceEdit> = {

	id: 'slice',

	canUse: true,

	init: createSliceEdit,

	exec() {
	}

}