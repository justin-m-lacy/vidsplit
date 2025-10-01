import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { WebSliceOp, WebSplitOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	onProgress(cb: (id: string, cur: number, total: number) => void) {

		ipcRenderer.on('progress', (_evt, id, cur, total) => cb(id, cur, total));

	},

	sliceMedia: (edit: WebSliceOp) => {

		return ipcRenderer.invoke('sliceMedia', {
			filePath: webUtils.getPathForFile(edit.file),
			slices: edit.slices,
			audio: edit.audio,
			video: edit.video
		});

	},
	splitMedia: (edit: WebSplitOp) => {

		return ipcRenderer.invoke('splitMedia', {
			filePath: webUtils.getPathForFile(edit.file),
			duration: edit.duration,
			cuts: edit.cuts,
			audio: edit.audio,
			video: edit.video
		});

	},
	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});