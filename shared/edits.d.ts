export type WebSplitOp = {
	id: string,
	file: File,
	/**
	 * splitting points.
	 * t is time of cut in seconds.
	 */
	cuts: Array<{ id: string, t: number }>,

	/**
	 * Total duration of video in seconds.
	 */
	duration: number,
	audio?: boolean,
	video?: boolean
}

///Path in the file system. Cannot use blob url
/// because of security policies.
export type NodeSplitOp = Omit<WebSplitOp, 'file'> & {
	filePath: string,
}

export type WebSliceOp = {
	id: string,
	file: File,
	slices: { from: number, to: number }[],
	audio?: boolean,
	video?: boolean
}

export type NodeSliceOp = Omit<WebSliceOp, 'file'> & {
	filePath: string,
}