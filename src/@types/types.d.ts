import type { WebCutOp, WebSliceOp, WebSplitOp } from "shared/edits";

declare global {
	interface Window {

		electron: {
			installFFMpeg(): Promise<{ path: string | undefined, version: string } | { err: string }>,
			checkFFMpeg(): Promise<{ version: string } | { err: string }>,
			onProgress(cb: (id: string, cur: number, total: number) => void),
			cutMedia(edit: WebCutOp): Promise<any>,
			sliceMedia(edit: WebSliceOp): Promise<any>,
			splitMedia(edit: WebSplitOp): Promise<any>
		}
	}
}