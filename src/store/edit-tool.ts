import { TEditTool, TMediaEdit } from "@/model/edit";
import { SliceTool } from "@/tools/slice";
import { SplitTool } from "@/tools/split";
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

	const setSliceMode = (media: MediaState) => {
		toggleTool(SliceTool, media)
	}

	const setSplitMode = (media: MediaState) => {
		toggleTool(SplitTool, media)
	}

	return {
		curEdit,
		setSliceMode,
		setSplitMode,
		tool: curTool,
		toggleTool,
		beginEdit,
		clearTool
	}

});