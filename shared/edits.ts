
export type MediaSlice = {
	id: string,
	from: number,
	to: number,
	snapshot?: string
}

export type SplitOp = {
	/**
 * Path in the file system. Cannot use blob url
 * because of security policies.
 */

	file: File,
	cuts: Array<{ id: string, t: number }>,
	audio?: boolean,
	video?: boolean
}

export type WebSliceOp = {
	file: File,
	slices: MediaSlice[],
	audio?: boolean,
	video?: boolean
}
