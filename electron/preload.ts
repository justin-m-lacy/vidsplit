import { contextBridge, ipcRenderer } from 'electron';
import type { SliceOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	saveSlice: (edit: SliceOp) => {
		return ipcRenderer.invoke('save-slice', edit);
	},
	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});