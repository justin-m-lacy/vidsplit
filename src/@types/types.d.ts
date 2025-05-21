import type { WebSliceOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			saveSlice(edit: WebSliceOp): Promise<any>
		}
	}
}