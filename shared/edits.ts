
export type MediaSlice = {
	id: string,
	left: number,
	right: number
}

export type OpResult = {
	id: string,
	mediaUrl: string
}

/**
 * Operation to slice media
 */
export type SliceOp = {

	// unique id to identify operation.
	id: string,
	mediaUrl: string,
	slices: MediaSlice[],

}

