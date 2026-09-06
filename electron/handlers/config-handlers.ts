import { type IpcMain } from 'electron';
import { getFFMpegVers, installFFmpeg } from '../ffmpeg/install';

function errToStr(err: unknown) {
	if (typeof err == 'string') {
		return err;
	} else if (err instanceof Error) {
		return err.message
	}
	return 'An unknown error has occurred.';
}


export function handleCheckFFMpeg(ipcMain: IpcMain) {

	ipcMain.handle('checkFFMpeg',
		async (_evt): Promise<{ path: string, version: string } | { err: string }> => {
			try {
				return await getFFMpegVers()
			} catch (err) {
				return { err: errToStr(err) }
			}
		});

}


export function handleInstallFFMpeg(ipcMain: IpcMain) {

	ipcMain.handle('installFFMpeg',
		async (_evt): Promise<{ path: string | undefined, version: string | undefined } | { err: string }> => {
			try {
				return await installFFmpeg();
			} catch (err) {
				return { err: errToStr(err) }
			}
		});

}