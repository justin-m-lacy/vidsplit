import { app, BrowserWindow } from 'electron';
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

app.whenReady().then(createWindow);