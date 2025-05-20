import type { TMediaInfo } from "@/model/media";

export type TMediaEdit = {

	id: string;
	toolId: string | Symbol;
	media: TMediaInfo;
	apply: () => Promise<any>;

}

export type TEditTool<D extends TMediaEdit = TMediaEdit> = {

	id: string | Symbol,

	canUse: boolean | ((media: TMediaInfo) => boolean),

	init: (media: TMediaInfo) => D;

}