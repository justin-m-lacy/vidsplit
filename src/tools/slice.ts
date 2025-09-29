import type { TEditTool, TMediaEdit } from "@/model/edit";
import type { MediaState } from "@/view/composables/media-state";
import { MediaSlice } from '../../shared/edits';

/**
 * Slice sections from the source video into a new video.
 */
export type SliceEdit = TMediaEdit & ReturnType<typeof makeSliceEdit>;

export function IsSliceEdit(edit?: TMediaEdit): edit is SliceEdit {
	return edit != null && edit.toolId === SliceTool.id;
}

// removed from tool to avoid circular typescript ref.
const SliceId = Symbol('slice');

function makeSliceEdit(media: MediaState) {

	const slices = shallowRef<MediaSlice[]>([]);

	/**
	 * Add media slice from current left/right percents.
	 * @param from - clip position in seconds
	 * @param to - clip position in seconds
	 * @param snapshot - snapshot string data.
	 */
	const addSlice = (from: number, to: number, snapshot?: string) => {

		const duration = media.duration;
		if (!duration || Number.isNaN(duration)) {
			throw new Error('Invalid Duration');
		}

		slices.value.push({
			id: window.crypto.randomUUID(),
			from,
			to,
			snapshot
		});

		triggerRef(slices);

	}

	const removeSlice = (slice: MediaSlice) => {

		const id = slice.id;
		slices.value = slices.value.filter(s => s.id !== id);

	}

	/// apply operation.
	const apply = async () => {

		if (slices.value.length === 0) return;

		return window.electron.saveSlice({

			file: media.file!,
			slices: slices.value.concat(),

		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: SliceId,
		apply,
		media,
		get slices() { return slices.value },
		set slices(v: MediaSlice[]) { slices.value = v; },
		addSlice,
		removeSlice
	};

}

export const SliceTool: TEditTool<SliceEdit> = {

	id: SliceId,

	canUse: true,

	beginEdit: makeSliceEdit

}