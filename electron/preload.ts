import { contextBridge, ipcRenderer } from 'electron';
import type { OpResult, SliceOp } from '../shared/edits';

const resolves = new Map<string, (arg: any) => void>();
const rejects = new Map<string, (arg: any) => void>();

contextBridge.executeInMainWorld({

	func() {

		ipcRenderer.on('success', (evt, op: OpResult) => {

			const res = resolves.get(op.id);
			if (res) {
				res(op);
			}
			resolves.delete(op.id);
			rejects.delete(op.id);

		});
		ipcRenderer.on('fail', (evt, op: OpResult) => {

			const rej = rejects.get(op.id);
			if (rej) {
				rej(op);
			}
			resolves.delete(op.id);
			rejects.delete(op.id);

		});

	}
});

// Safe exposure of Node features
contextBridge.exposeInMainWorld('electron', {

	saveSlice: (edit: SliceOp) => {

		return new Promise((res, rej) => {

			resolves.set(edit.id, res);
			rejects.set(edit.id, rej);

			ipcRenderer.send('saveSlice', edit);

		});

	}

});