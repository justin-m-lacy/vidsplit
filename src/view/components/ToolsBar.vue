<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { IsSliceEdit, SliceTool } from '@/tools/slice';
import { Download } from 'lucide-vue-next';

const props = defineProps<{
	media?: HTMLMediaElement
}>();

const tools = useEditTool();

const usingSlice = computed(() => tools.tool?.id == SliceTool.id);

function addSlice() {

	if (IsSliceEdit(tools.curEdit)) {
		tools.curEdit.addSlice();
	}
}

function saveSlice() {
	if (IsSliceEdit(tools.curEdit)) {
		tools.curEdit.apply();
	}
}

function setSliceMode() {

	if (!props.media) return;
	tools.toggleTool(SliceTool, props.media);
}

function sliceClass() {
	return [
		usingSlice.value ? 'outline-2 outline-solid outline-blue-600' : ''
	]
}
</script>
<template>
	<div class="flex justify-stretch items-center">
		<button type="button"
				:class="sliceClass()"
				@click="setSliceMode">✂</button>

		<button v-if="usingSlice" type="button"
				@click="addSlice">+Add Slice</button>
		<button v-if="IsSliceEdit(tools.curEdit)" type="button"
				:disabled="tools.curEdit.slices.value.length == 0"
				@click="saveSlice">
			<Download />
		</button>
	</div>
</template>