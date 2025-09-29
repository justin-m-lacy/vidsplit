import type { WebSliceOp, WebSplitOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			sliceMedia(edit: WebSliceOp): Promise<any>,
			splitMedia(edit: WebSplitOp): Promise<any>
		}
	}
}