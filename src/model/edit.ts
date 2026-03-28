import type { MediaState } from "@/view/composables/media-state";

export type TMediaEdit = {

	id: string;
	toolId: string | Symbol;
	media: MediaState;
	apply: () => Promise<any>;
	reset?: () => void;

}

export type TEditTool<D extends TMediaEdit = TMediaEdit> = {

	id: string | Symbol,

	canUse: boolean | ((media: MediaState) => boolean),

	newEdit: (media: MediaState) => D;

}