import { TEditTool, TMediaEdit } from "@/model/edit";
import { SliceTool } from "@/tools/slice";
import type { MediaState } from "@/view/composables/media-state";
import { defineStore } from "pinia";
import type { TResolution } from "shared/edits";

export const useEditTool = defineStore('editTool', () => {

	const curTool = shallowRef<TEditTool>();
	const curEdit = shallowRef<TMediaEdit>();

	const resolution = ref<TResolution>({ width: 0, height: 0 });

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
		resolution
	}

});