import type { SplitOp, WebSliceOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			saveSlice(edit: WebSliceOp): Promise<any>,
			splitMedia(edit: SplitOp): Promise<any>
		}
	}
}