
export type MediaSlice = {
	id: string,
	from: number,
	to: number,
	screenshot?: string
}

export type OpResult = {
	mediaUrl: string
}

export type Op = {
	mediaUrl: string
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

