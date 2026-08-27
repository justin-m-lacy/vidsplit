import { CurvesFilter, FpsFilter, RangeFilter, ScaleFilter } from "shared/filters";

type VideoOp = {
	id: string,
	file: File,
	audio?: boolean,
	video?: boolean,
} & Partial<ScaleFilter>;

export type WebSplitOp = VideoOp & {
	/**
	 * splitting points.
	 * t is time of cut in seconds.
	 */
	cuts: Array<{ id: string, t: number }>,

	/**
	 * Total duration of video in seconds.
	 */
	duration: number
}

///Path in the file system. Cannot use blob url
/// because of security policies.
export type NodeSplitOp = Omit<WebSplitOp, 'file'> & {
	filePath: string,
}

type Maybe<D> = D | {};
/**
 * Converts optional key to required key.
 */
type With<T extends object, K extends keyof T> = T & { [p in K]-?: T[p] };

export type SliceInfo = RangeFilter & Partial<FpsFilter> & Partial<CurvesFilter>;

export type WebCutOp = VideoOp & {
	cuts: RangeFilter[],
	duration: number,
	// whether to seek early for frame perfect slicing.
	perfect?: boolean
}
export type WebSliceOp = VideoOp & {
	slices: SliceInfo[],
	// whether to seek early for frame perfect slicing.
	perfect?: boolean
}

export type NodeSliceOp = Omit<WebSliceOp, 'file'> & {
	filePath: string,
	// total duration of pre-sliced video in seconds.
	duration: number,
	// seconds to seek before encoding for better accuracy.
	lead?: number,
	type: 'join' | 'cut'
}