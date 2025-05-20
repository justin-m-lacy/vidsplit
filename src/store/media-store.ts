import { defineStore } from "pinia";

export const useMediaStore = defineStore('media', () => {

	const sourceUrl = shallowRef<string>();

	function setSource(data: Blob | MediaSource) {

		if (sourceUrl.value) {
			URL.revokeObjectURL(sourceUrl.value);
		}
		sourceUrl.value = URL.createObjectURL(data);

	}

	return {
		get sourceUrl() { return sourceUrl.value },
		setSource,

	}

});