import type { TMediaInfo } from "@/model/media";

export type TMediaEdit = {

	id: string;
	tool: string;
	media: TMediaInfo;

}

export type TEditTool<D extends TMediaEdit = TMediaEdit> = {

	id: string,

	canUse: boolean | ((media: TMediaInfo) => boolean),

	init: (media: TMediaInfo) => D;

	exec: () => void;

}