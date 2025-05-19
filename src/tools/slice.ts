import type { TEditMode } from "@/model/edit";
import { TMediaInfo, type TrackPoint } from '../model/media';

export type SliceEdit = {

	id: string;

	media: TMediaInfo;

	readonly slices: [TrackPoint, TrackPoint][];

}


export const SliceMode: TEditMode<SliceEdit> = {

	id: 'slice',

	canUse: true,

	init: (media: TMediaInfo) => {

		return {
			id: window.crypto.randomUUID(),
			media,
			slices: []

		};

	},

	exec() {
	}

}