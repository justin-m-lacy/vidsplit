import { defineStore } from 'pinia';

export const useAppState = defineStore('appState', () => {

	// assume available until first check shows as 'false'
	const ffmpegVers = shallowRef(true);
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
			const res = await window.electron.testFFMpeg();
			if (typeof res === 'boolean') {
				ffmpegVers.value = res;
			} else {
				ffmpegVers.value = false;
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
		installFFMpeg,
		checkFFMpeg,
	}

})