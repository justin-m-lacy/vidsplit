import type { TEditTool, TMediaEdit } from "@/model/edit";
import { InvalidDurationError } from "@/model/errors";
import type { MediaState } from "@/view/composables/media-state";
import { RangeFilter } from "shared/filters";

export type MediaCut = RangeFilter & {
	id: string,
	snapshot?: string
}


/**
 * Cut sections from the source video into a new video.
 */
export type CutEdit = TMediaEdit & ReturnType<typeof makeCutEdit>;

// removed from tool to avoid circular typescript ref.
const CutId = Symbol('cut');

export function IsCutEdit(edit?: TMediaEdit): edit is CutEdit {
	return edit?.toolId === CutId;
}

function makeCutEdit(media: MediaState) {

	const cuts = shallowRef<MediaCut[]>([]);

	/**
	 * Add media slice from current left/right percents.
	 * @param from - clip position in seconds
	 * @param to - clip position in seconds
	 * @param snapshot - snapshot string data.
	 */
	const addCut = (from: number, to: number, snapshot?: string) => {

		const duration = media.duration;
		if (!duration || Number.isNaN(duration)) {
			throw InvalidDurationError();
		}

		cuts.value.push({
			id: window.crypto.randomUUID(),
			from,
			to,
			snapshot
		});

		triggerRef(cuts);

	}

	const removeCut = (cut: MediaCut) => {

		const id = cut.id;
		cuts.value = cuts.value.filter(s => s.id !== id);

	}

	/// apply operation.
	async function apply(this: MediaCut) {

		if (cuts.value.length === 0) return;

		return window.electron.cutMedia({

			id: this.id,
			file: media.file!,
			cuts: cuts.value.concat(),

		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: CutId,
		apply,
		media,
		reset() {
			cuts.value = []
		},
		get cuts() { return cuts.value },
		set cuts(v: MediaCut[]) { cuts.value = v; },
		addCut,
		removeCut
	};

}

export const CutTool: TEditTool<CutEdit> = {

	id: CutId,

	canUse: true,

	newEdit: makeCutEdit

}