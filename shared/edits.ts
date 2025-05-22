
export type MediaSlice = {
	id: string,
	from: number,
	to: number,
	snapshot?: string
}

export type OpResult = {
}

export type Op = {

	/**
	 * Path in the file system. Cannot use blob url
	 * because of security policies.
	 */
	filePath: string;

}

export type WebSliceOp = {
	file: File,
	slices: MediaSlice[],
	audio?: boolean,
	video?: boolean
}
/**
 * Operation to slice media
 */
export type SliceOp = Op & {

	slices: MediaSlice[],

	/// whether media has audio
	audio?: boolean

	/// whether media has video
	video?: boolean

}

