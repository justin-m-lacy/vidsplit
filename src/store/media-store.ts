import { defineStore } from "pinia";

export const useMediaStore = defineStore('media', () => {

	const sourceUrl = shallowRef<string>();

	function setSource(data: Blob | MediaSource) {

		clearSource();
		sourceUrl.value = URL.createObjectURL(data);

	}

	function clearSource() {
		if (sourceUrl.value) {
			URL.revokeObjectURL(sourceUrl.value);
		}
		sourceUrl.value = undefined;
	}

	return {
		sourceUrl,
		setSource,
		clearSource,

	}

});