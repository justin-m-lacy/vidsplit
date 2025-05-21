import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { handleSlice } from './handlers';

const createWindow = () => {

	const win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});

	handleSlice(ipcMain);

	win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));

}

app.whenReady().then(createWindow);
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
