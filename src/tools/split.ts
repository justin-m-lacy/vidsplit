import { TMediaEdit, type TEditTool } from "@/model/edit";
import { useOptions } from "@/store/options-store";
import { MediaState } from "@/view/composables/media-state";

/**
 * Split a complete source video into separate parts.
 */
export type SplitEdit = TMediaEdit & ReturnType<typeof makeSplitEdit>;

/**
 * @property id - used to make each cut unique
 * (for moving, deleting, cuts)
 * t - media cut point in seconds.
 */
export type MediaCut = {
	id: string,
	pct: number
}

export function IsSplitEdit(edit?: TMediaEdit): edit is SplitEdit {
	return edit?.toolId === SplitTool.id;
}

function makeSplitEdit(this: TEditTool, media: MediaState) {

	const cuts = ref<Record<string, MediaCut>>(Object.create(null));

	const findCut = (pct: number) => {
		const vals = cuts.value;
		for (const k in vals) {
			if (vals[k].pct == pct) return vals[k]
		}
		return null;
	}

	/**
	 * convert cut percents to time-based cuts.
	 */
	const toTimeArray = (cuts: Record<string, MediaCut>, media: MediaState) => {

		const duration = media.duration;
		const a: { id: string, t: number }[] = [];

		for (const k in cuts) {

			const t = duration * cuts[k].pct;

			if (!a.some(v => v.t == t)) {
				a.push({
					id: cuts[k].id,
					t
				});
			}

		}

		return a.sort((a, b) => a.t - b.t);

	}

	const addCut = (pct: number): MediaCut => {

		const find = findCut(pct);
		// don't allow duplicate percents.
		if (find) return find;

		const v = {
			id: window.crypto.randomUUID(),
			pct
		}
		return cuts.value[v.id] = v;
	}

	const removeCut = (cut: MediaCut) => {
		delete cuts.value[cut.id];
	}

	/**
	 * Apply split operation.
	 */
	async function apply(this: SplitEdit) {

		const options = useOptions().store;

		// convert from percents to time in seconds.
		return window.electron.splitMedia({
			id: this.id,
			file: this.media.file!,
			duration: this.media.duration,
			cuts: toTimeArray(this.cuts, this.media),
			perfect: options.video?.framePerfect,
			codec: options.video?.codec
		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: this.id,
		apply,
		media,
		get cuts() { return cuts.value },
		addCut,
		removeCut
	};

}

export const SplitTool: TEditTool<SplitEdit> = {

	id: Symbol('split'),

	canUse: true,

	newEdit: makeSplitEdit

}

