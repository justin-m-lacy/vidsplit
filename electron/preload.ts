import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { SplitOp, WebSliceOp } from '../shared/edits';

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
	splitMedia: (edit: SplitOp) => {

		const path = webUtils.getPathForFile(edit.file)
		return ipcRenderer.invoke('splitMedia', {
			filePath: path,
			cuts: edit.cuts,
			audio: edit.audio,
			video: edit.video
		});

	},
	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});