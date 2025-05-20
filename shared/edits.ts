
export type MediaSlice = {
	id: string,
	left: number,
	right: number
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

