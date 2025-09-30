import { TMediaEdit, type TEditTool } from "@/model/edit";
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
	return edit?.toolId === SplitId;
}


const SplitId = Symbol('split');

function makeSplitEdit(media: MediaState) {

	const cuts = ref<MediaCut[]>([]);

	const addCut = (pct: number): MediaCut | null => {

		// don't allow duplicate percents.
		if (cuts.value.some(v => v.pct == pct)) {
			return null;
		}

		const v = {
			id: window.crypto.randomUUID(),
			pct
		}
		cuts.value.push(v)

		return v;
	}

	const removeCut = (cut: MediaCut) => {
		const id = cut.id;
		cuts.value = cuts.value.filter(s => s.id !== id);

	}

	/// apply operation.
	const apply = async () => {

		if (cuts.value.length === 0) return;

		const duration = media.duration;

		const curCuts = cuts.value;
		curCuts.sort((a, b) => a.pct - b.pct);
		// remove any potential duplicate positions.
		for (let i = curCuts.length - 1; i >= 1; i--) {
			if (curCuts[i].pct == curCuts[i - 1].pct) {
				curCuts.splice(i, 1);
			}
		}

		// convert from percents to time in seconds.
		return window.electron.splitMedia({

			file: media.file!,
			duration,
			cuts: cuts.value.map(v => ({
				id: v.id,
				t: duration * v.pct
			}))

		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: SplitId,
		apply,
		media,
		get cuts() { return cuts.value },
		set cuts(v: MediaCut[]) { cuts.value = v; },
		addCut,
		removeCut
	};

}

export const SplitTool: TEditTool<SplitEdit> = {

	id: SplitId,

	canUse: true,

	beginEdit: makeSplitEdit

}

