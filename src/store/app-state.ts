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

	async function installFFMpeg() {

		if (installingFFMpeg.value) return;
		if (!electron.value) return;

		try {

			installingFFMpeg.value = true;

		} catch (err) {

		}

		installingFFMpeg.value = false;
	}

	async function checkFFMpeg() {
		// already checking.
		if (checkingFFMpeg.value) return;
		if (!electron.value) return;

		try {

			checkingFFMpeg.value = true;
			const res = await window.electron.checkFFMpeg();
			if ('version' in res) {
				hasFFMpeg.value = true;
				ffmpegVers.value = res.version;
			} else {
				hasFFMpeg.value = false;
				ffmpegVers.value = undefined;
				ffmpegErr.value = res.err;
			}

		} catch (err) {

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