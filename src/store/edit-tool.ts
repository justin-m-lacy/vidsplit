import { TEditTool, TMediaEdit } from "@/model/edit";
import { SliceTool } from "@/tools/slice";
import type { MediaState } from "@/view/composables/media-state";
import { defineStore } from "pinia";

export const useEditTool = defineStore('editTool', () => {

	const curTool = shallowRef<TEditTool>();
	const curEdit = shallowRef<TMediaEdit>();

	function clearTool() {
		curTool.value = undefined;
		curEdit.value = undefined;
	}

	function toggleTool(tool: TEditTool, media: MediaState) {
		if (curTool.value?.id == tool.id) {
			clearTool();
		} else {
			beginEdit(tool, media)
		}
	}

	function beginEdit(tool: TEditTool, media: MediaState) {

		if (curTool.value?.id != tool.id) {
			curEdit.value = tool.beginEdit(media);
			curTool.value = tool;
		}

	}

	const usingSlice = computed(() => {
		return curTool.value?.id == SliceTool.id;
	});

	return {
		curEdit,
		usingSlice,
		tool: curTool,
		toggleTool,
		beginEdit,
		clearTool,
	}

});