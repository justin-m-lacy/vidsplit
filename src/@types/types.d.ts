import type { SliceOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			saveSlice(edit: SliceOp): Promise<any>
		}
	}
}