import type { MediaState } from "@/view/composables/media-state";

export type TMediaEdit = {

	id: string;
	toolId: string | Symbol;
	media: MediaState;
	apply: () => Promise<any>;

}

export type TEditTool<D extends TMediaEdit = TMediaEdit> = {

	id: string | Symbol,

	canUse: boolean | ((media: MediaState) => boolean),

	beginEdit: (media: MediaState) => D;

}