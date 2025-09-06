import type { MediaState } from "@/view/composables/media-state";
import type { TResolution } from "shared/edits";

export type TMediaEdit = {

	id: string;
	toolId: string | Symbol;
	media: MediaState;
	apply: (scale?: TResolution) => Promise<any>;

}

export type TEditTool<D extends TMediaEdit = TMediaEdit> = {

	id: string | Symbol,

	canUse: boolean | ((media: MediaState) => boolean),

	beginEdit: (media: MediaState) => D;

}