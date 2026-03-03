import type { WebSliceOp, WebSplitOp } from "shared/edits"

declare global {
	interface Window {

		electron: {
			installFFMpeg(): Promise<{ version: string } | { err: string }>,
			checkFFMpeg(): Promise<{ version: string } | { err: string }>,
			onProgress(cb: (id: string, cur: number, total: number) => void),
			sliceMedia(edit: WebSliceOp): Promise<any>,
			splitMedia(edit: WebSplitOp): Promise<any>
		}
	}
}