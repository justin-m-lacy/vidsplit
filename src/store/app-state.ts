import { defineStore } from 'pinia';

export const useAppState = defineStore('appState', () => {

	const FFMpegUrl = `https://ffmpeg.org/download.html`;

	// assume available until first check shows as 'false'
	const hasFFMpeg = shallowRef<boolean>(true);
	const ffmpegVers = shallowRef<string | undefined>(undefined);

	const ffmpegErr = shallowRef<undefined | string>(undefined);

	const checkingFFMpeg = shallowRef(false);
	const installingFFMpeg = shallowRef(false);

	const electron = shallowRef(window.electron);

	function setFFMpegInfo(info: { version: string, path?: string } | { err: string }) {
		if ('version' in info) {
			hasFFMpeg.value = true;
			ffmpegVers.value = info.version;
		} else {
			hasFFMpeg.value = false;
			ffmpegErr.value = info.err;
			ffmpegVers.value = undefined;
		}
	}

	async function installFFMpeg() {

		if (installingFFMpeg.value) return;
		if (!electron.value) return;

		try {

			installingFFMpeg.value = true;
			const res = await electron.value.installFFMpeg();
			setFFMpegInfo(res);

		} catch (err) {

			hasFFMpeg.value = false;
			ffmpegVers.value = undefined;

		} finally {
			installingFFMpeg.value = false;
		}

	}

	async function checkFFMpeg() {
		// already checking.
		if (checkingFFMpeg.value) return;
		if (!electron.value) return;

		try {

			checkingFFMpeg.value = true;
			const res = await window.electron.checkFFMpeg();
			setFFMpegInfo(res);

		} catch (err: any) {
			ffmpegErr.value = typeof err == 'string' ? err : '';
		}
		checkingFFMpeg.value = false;

	}

	checkFFMpeg();

	return {

		// electron availability.
		electron,
		installingFFMpeg,
		checkingFFMpeg,
		ffmpegVers,
		hasFFMpeg,
		installFFMpeg,
		checkFFMpeg,
	}

})