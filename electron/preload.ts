import { contextBridge, ipcRenderer } from 'electron';
import type { SliceOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	saveSlice: (edit: SliceOp) => {

		ipcRenderer.send('saveSlice', edit);

	}

});