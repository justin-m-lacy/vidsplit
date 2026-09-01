import type { TEditTool, TMediaEdit } from "@/model/edit";
import type { MediaState } from "@/view/composables/media-state";


/**
 * Cut sections from the source video into a new video.
 */
export type EncodeEdit = TMediaEdit & {
	codec?: 'libx264' | 'libx265' | 'libvpx-vp9' | 'libsvtav1',
	duration: number
}

// removed from tool to avoid circular typescript ref.
const EncodeId = Symbol('encode');

export function IsEncodeEdit(edit?: TMediaEdit): edit is EncodeEdit {
	return edit?.toolId === EncodeId;
}


function newEncodeEdit(this: TEditTool, media: MediaState): EncodeEdit {

	/// apply operation.
	async function apply(this: EncodeEdit) {

		return window.electron.encodeMedia({

			id: this.id,
			file: media.file!,
			duration: media.duration,
			codec: this.codec

		});
	}

	return {
		id: window.crypto.randomUUID(),
		toolId: this.id,
		apply,
		media,
		codec: undefined,
		get duration() { return media.duration },
		reset() {
			this.codec = undefined;
		},
	};

}

export const EncodeTool: TEditTool<EncodeEdit> = {

	id: Symbol('encode'),

	canUse: true,

	newEdit: newEncodeEdit

}