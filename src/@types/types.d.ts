import type { WebCutOp, WebEncodeOp, WebSliceOp, WebSplitOp } from "shared/edits";
import { TaskUpdate } from "shared/tasks";

declare global {
	interface Window {

		electron: {
			installFFMpeg(): Promise<{ path: string | undefined, version: string } | { err: string }>,
			checkFFMpeg(): Promise<{ version: string } | { err: string }>,
			onProgress(cb: (id: string, cur: number, total: number) => void),
			cutMedia(edit: WebCutOp): Promise<TaskUpdate>,
			encodeMedia(edit: WebEncodeOp): Promise<TaskUpdate>,
			sliceMedia(edit: WebSliceOp): Promise<TaskUpdate>,
			splitMedia(edit: WebSplitOp): Promise<TaskUpdate>
		}
	}
}