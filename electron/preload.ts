import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { WebScaleOp, WebSliceOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	saveSlice: (edit: WebSliceOp) => {

		const path = webUtils.getPathForFile(edit.file)
		return ipcRenderer.invoke('save-slice', {
			filePath: path,
			slices: edit.slices,
			audio: edit.audio,
			video: edit.video,
			scale: edit.scale
		});

	},
	changeResolution: (op: WebScaleOp) => {

		const path = webUtils.getPathForFile(op.file);
		return ipcRenderer.invoke('set-scale', {
			filePath: path,
			scale: op.scale,
			audio: op.audio,
			video: op.video
		});

	},

	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});