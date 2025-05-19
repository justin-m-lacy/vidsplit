import { TEditTool, TMediaEdit } from "@/model/edit";
import type { TMediaInfo } from "@/model/media";
import { defineStore } from "pinia";

export const useEditTool = defineStore('editMode', () => {

	const curTool = shallowRef<TEditTool>();

	const curEdit = shallowRef<TMediaEdit>();

	function clearTool() {
		curTool.value = undefined;
		curEdit.value = undefined;
	}

	function beginEdit(tool: TEditTool, media: TMediaInfo) {

		if (curTool.value?.id != tool.id) {
			curEdit.value = tool.init(media);
			curTool.value = tool;
		}

	}

	return {
		curEdit,
		tool: curTool,
		beginEdit,
		clearTool,
	}

});