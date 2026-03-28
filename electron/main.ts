import { app, BrowserWindow, ipcMain, shell } from 'electron';
import * as path from 'path';
import {
	handleCheckFFMpeg,
	handleInstallFFMpeg,
	handleOpenMedia, handleSlice, handleSplit
} from './handlers';

const createWindow = () => {

	const win = new BrowserWindow({
		width: 800,
		height: 640,
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: path.join(import.meta.dirname, 'preload.js'),
			contextIsolation: true
		}
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	win.loadFile(path.join(import.meta.dirname, './render/index.html'));

}

app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
});

handleCheckFFMpeg(ipcMain);
handleInstallFFMpeg(ipcMain);
handleOpenMedia(ipcMain);
handleSlice(ipcMain, app);
handleSplit(ipcMain, app);