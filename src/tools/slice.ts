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
export type SliceEdit = TMediaEdit & ReturnType<typeof makeSliceEdit>;

// removed from tool to avoid circular typescript ref.
const SliceId = Symbol('slice');

export function IsSliceEdit(edit?: TMediaEdit): edit is SliceEdit {
	return edit?.toolId === SliceId;
}

function makeSliceEdit(media: MediaState) {

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
	async function apply(this: MediaSlice) {

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
		toolId: SliceId,
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

	id: SliceId,

	canUse: true,

	newEdit: makeSliceEdit

}