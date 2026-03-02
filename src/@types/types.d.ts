import type { WebSliceOp, WebSplitOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			testFFMpeg(): boolean | { err: string },
			onProgress(cb: (id: string, cur: number, total: number) => void),
			sliceMedia(edit: WebSliceOp): Promise<any>,
			splitMedia(edit: WebSplitOp): Promise<any>
		}
	}
}