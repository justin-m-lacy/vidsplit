import { CurvesFilter, FpsFilter, RangeFilter, ScaleFilter } from "shared/filters";

type WebVideoOp = {
	id: string,
	file: File,
	audio?: boolean,
	video?: boolean,
	codec?: 'libx264' | 'libx265' | 'libvpx-vp9' | 'libsvtav1',
	// whether to seek early for frame perfect slicing.
	perfect?: boolean
} & Partial<ScaleFilter>;

export type WebSplitOp = WebVideoOp & {
	/**
	 * splitting points. t is time in seconds.
	 */
	cuts: Array<{ id: string, t: number }>,

	/**
	 * total video duration in seconds.
	 */
	duration: number
}

/**
 * Convert optional key to required key.
 */
type With<T extends object, K extends keyof T> = T & { [p in K]-?: T[p] };

export type SliceInfo = RangeFilter & Partial<FpsFilter> & Partial<CurvesFilter>;

export type WebEncodeOp = Omit<WebVideoOp, 'perfect'> & { duration: number };

export type WebCutOp = WebVideoOp & {
	cuts: RangeFilter[],
	duration: number,

}
export type WebSliceOp = WebVideoOp & {
	slices: SliceInfo[],
}

type NodeVideoOp<T extends WebVideoOp> = Omit<T, 'file' | 'perfect'> & {
	/**
	 * system path to file.
	 */
	filePath: string,
	// seconds to seek before encoding for better accuracy.
	lead?: number,
}

export type NodeEncodeOp = NodeVideoOp<WebEncodeOp>;

export type NodeSplitOp = NodeVideoOp<WebSplitOp>;

export type NodeSliceOp = NodeVideoOp<WebSliceOp> & {
	// total duration of pre-sliced video in seconds.
	duration: number,
	type: 'join' | 'cut'
}