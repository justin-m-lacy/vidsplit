import { TEditTool, TMediaEdit } from "@/model/edit";
import { CutTool } from "@/tools/cut";
import { EncodeTool } from "@/tools/encode";
import { SliceTool } from "@/tools/slice";
import { SplitTool } from "@/tools/split";
import type { MediaState } from "@/view/composables/media-state";
import { defineStore } from "pinia";

export const useEditTool = defineStore('editTool', () => {

	const curTool = shallowRef<TEditTool>();
	const curEdit = shallowRef<TMediaEdit>();

	function clearTool() {
		curEdit.value = undefined;
		curTool.value = undefined;
	}

	function toggleTool(tool: TEditTool, media?: MediaState) {
		if (!media || curTool.value?.id == tool.id) {
			clearTool();
		} else {
			newEdit(tool, media)
		}
	}

	function newEdit(tool: TEditTool, media: MediaState) {

		if (curTool.value?.id != tool.id) {
			curEdit.value = tool.newEdit(media);
			curTool.value = tool;
		}

	}

	function setEncodeMode(media: MediaState) {
		toggleTool(EncodeTool, media)
	}

	const setSliceMode = (media?: MediaState) => {
		toggleTool(SliceTool, media)
	}

	const setSplitMode = (media?: MediaState) => {
		toggleTool(SplitTool, media)
	}

	const setCutMode = (media?: MediaState) => {
		toggleTool(CutTool, media);
	}

	return {
		curEdit,
		setSliceMode,
		setSplitMode,
		setCutMode,
		setEncodeMode,
		tool: curTool,
		toggleTool,
		clearTool
	}

});