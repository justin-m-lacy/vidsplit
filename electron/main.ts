import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

const createWindow = () => {

	const win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));

}

ipcMain.on('saveSlice', () => {

});

app.whenReady().then(createWindow);