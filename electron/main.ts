import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { handleOpenMedia, handleSlice, handleSplit } from './handlers';

const createWindow = () => {

	const win = new BrowserWindow({
		width: 800,
		height: 640,
		webPreferences: {
			preload: path.join(import.meta.dirname, 'preload.js'),
			contextIsolation: true
		}
	});

	handleOpenMedia();
	handleSlice(ipcMain, win, app);
	handleSplit(ipcMain, win, app);

	win.loadFile(path.join(import.meta.dirname, './render/index.html'));

}

app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
