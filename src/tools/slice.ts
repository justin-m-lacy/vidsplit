import type { TEditTool, TMediaEdit } from "@/model/edit";
import { InvalidDurationError } from "@/model/errors";
import { useOptions } from "@/store/options-store";
import type { MediaState } from "@/view/composables/media-state";
import { SliceInfo } from "shared/edits";

export type MediaSlice = SliceInfo & {
	id: string,
	snapshot?: string
}

/**
 * Slice sections from the source video into a new video.
 */
export type SliceEdit = ReturnType<typeof makeSliceEdit>;

export function IsSliceEdit(edit?: TMediaEdit): edit is SliceEdit {
	return edit?.toolId === SliceTool.id;
}

function makeSliceEdit(this: TEditTool, media: MediaState) {

	const slices = shallowRef<MediaSlice[]>([]);

	/**
	 * Add media slice from current left/right percents.
	 * @param from - clip time in seconds
	 * @param to - clip time in seconds
	 * @param snapshot - snapshot string data.
	 */
	const addSlice = (from: number, to: number, snapshot?: string) => {

		const duration = media.duration;
		if (!duration || Number.isNaN(duration)) {
			throw InvalidDurationError();
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
		slices.value = slices.value.filter(s => s.id !== slice.id);
	}

	/// apply operation.
	async function apply(this: SliceEdit) {

		if (slices.value.length === 0) return;

		const options = useOptions().store;

		return window.electron.sliceMedia({

			id: this.id,
			file: media.file!,
			slices: slices.value.concat(),
			perfect: options.video?.framePerfect,
			codec: options.video?.codec
		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: this.id,
		apply,
		media,
		reset() {
			slices.value = []
		},
		get slices() { return slices.value },
		set slices(v: MediaSlice[]) { slices.value = v; },
		addSlice,
		removeSlice
	};

}

export const SliceTool: TEditTool<SliceEdit> = {

	id: Symbol('slice'),

	canUse: true,

	newEdit: makeSliceEdit

}