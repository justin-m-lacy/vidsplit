import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { WebSliceOp, WebSplitOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	sliceMedia: (edit: WebSliceOp) => {

		const path = webUtils.getPathForFile(edit.file)
		return ipcRenderer.invoke('sliceMedia', {
			filePath: path,
			slices: edit.slices,
			audio: edit.audio,
			video: edit.video
		});

	},
	splitMedia: (edit: WebSplitOp) => {

		const path = webUtils.getPathForFile(edit.file)
		return ipcRenderer.invoke('splitMedia', {
			filePath: path,
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