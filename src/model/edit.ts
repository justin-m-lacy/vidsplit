import type { TMediaInfo } from "@/model/media";

export type TMediaEdit = {

	id: string;
	media: TMediaInfo;

}

export type TEditMode<D extends TMediaEdit = TMediaEdit> = {

	id: string,

	canUse: boolean | ((media: TMediaInfo) => boolean),

	init: (media: TMediaInfo) => D;

	exec: () => void;

}