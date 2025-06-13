import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { WebResolutionOp, WebSliceOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	saveSlice: (edit: WebSliceOp) => {

		const path = webUtils.getPathForFile(edit.file)
		return ipcRenderer.invoke('save-slice', {
			filePath: path,
			slices: edit.slices,
			audio: edit.audio,
			video: edit.video
		});

	},
	changeResolution: (op: WebResolutionOp) => {

		const path = webUtils.getPathForFile(op.file);
		return ipcRenderer.invoke('set-resolution', {
			filePath: path,
			resolution: op.resolution,
			audio: op.audio,
			video: op.video
		});

	},

	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});