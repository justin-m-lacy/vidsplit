export type TResolution = {
	width: number,
	height: number
}

export type MediaSlice = {
	id: string,
	from: number,
	to: number,
	snapshot?: string
}

export type OpResult = {
}

export type WebSliceOp = {
	file: File,
	slices: MediaSlice[],
	audio?: boolean,
	video?: boolean
}

export type WebResolutionOp = {
	file: File,
	resolution: TResolution,
	audio?: boolean,
	video?: boolean
}

/**
 * Operation data on the server side.
 */
export type ServerOp = {

	/**
	 * Path in the file system. Cannot use blob url
	 * because of security policies.
	 */
	filePath: string;

	/// whether media has audio
	audio?: boolean;

	/// whether media has video
	video?: boolean;

}

export type SetResolutionData = ServerOp & {
	resolution: TResolution
}

/**
 * Operation to slice media
 */
export type SliceData = ServerOp & {

	slices: MediaSlice[],

}

