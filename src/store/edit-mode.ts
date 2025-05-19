import { TEditMode } from "@/model/edit";
import { defineStore } from "pinia";

export const useEditMode = defineStore('editMode', () => {

	const curMode = shallowRef<TEditMode>();

	function setMode(mode: TEditMode) {
		curMode.value = mode;
	}

	return {
		mode: curMode,
		setMode
	}

});