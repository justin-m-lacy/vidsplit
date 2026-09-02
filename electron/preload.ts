import { contextBridge, ipcRenderer, webUtils } from 'electron';
import type { WebCutOp, WebEncodeOp, WebSliceOp, WebSplitOp } from '../shared/edits';

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	/**
	 * surprisingly this is the official method for main->renderer communication.
	 */
	onProgress(cb: (id: string, cur: number, total: number) => void) {
		ipcRenderer.on('progress', (_evt, id, cur, total) => cb(id, cur, total));
	},

	checkFFMpeg(): Promise<{ path: string, version: string } | { err: string }> {
		return ipcRenderer.invoke('checkFFMpeg');
	},

	installFFMpeg(): Promise<{ path: string | undefined, version: string | undefined } | { err: string }> {
		return ipcRenderer.invoke('installFFMpeg');
	},

	/**
	 * reencode media with new encoder,fps, etc.
	 */
	encodeMedia: (edit: WebEncodeOp) => {

		return ipcRenderer.invoke('encodeMedia', {
			id: edit.id,
			filePath: webUtils.getPathForFile(edit.file),
			duration: edit.duration,
			audio: edit.audio,
			video: edit.video,
			codec: edit.codec
		});

	},

	cutMedia: (edit: WebCutOp) => {

		// convert to slice operation with 'cut' selected.
		return ipcRenderer.invoke('sliceMedia', {
			id: edit.id,
			filePath: webUtils.getPathForFile(edit.file),
			type: 'cut',
			slices: edit.cuts,
			audio: edit.audio,
			video: edit.video,
			duration: edit.duration,
			lead: edit.perfect ? 5 : undefined,
			codec: edit.codec
		});

	},

	sliceMedia: (edit: WebSliceOp) => {

		return ipcRenderer.invoke('sliceMedia', {
			id: edit.id,
			filePath: webUtils.getPathForFile(edit.file),
			type: 'join',
			slices: edit.slices,
			lead: edit.perfect ? 5 : undefined,
			audio: edit.audio,
			video: edit.video,
			codec: edit.codec
		});

	},

	splitMedia: (edit: WebSplitOp) => {

		return ipcRenderer.invoke('splitMedia', {
			id: edit.id,
			filePath: webUtils.getPathForFile(edit.file),
			duration: edit.duration,
			cuts: edit.cuts,
			audio: edit.audio,
			video: edit.video,
			lead: edit.perfect ? 5 : undefined,
			codec: edit.codec
		});

	},
	loadMedia: (): Promise<string | null> => {
		return ipcRenderer.invoke('open-media');
	}

});