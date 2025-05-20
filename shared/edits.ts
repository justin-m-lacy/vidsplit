
export type MediaSlice = {
	id: string,
	from: number,
	to: number
}

export type OpResult = {
	// id of original operation.
	id: string,
	mediaUrl: string
}

export type Op = {
	// unique id to identify operation.
	id: string,
	mediaUrl: string
}

/**
 * Operation to slice media
 */
export type SliceOp = Op & {

	slices: MediaSlice[],

}

