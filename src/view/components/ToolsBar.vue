<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { SliceTool } from '@/tools/slice';
import { MediaState } from '@/view/composables/media-state';

const props = defineProps<{
	media?: MediaState
}>();

const tools = useEditTool();

function setSliceMode() {

	if (!props.media?.hasMedia) return;
	tools.toggleTool(SliceTool, props.media);
}

function sliceClass() {
	return [
		tools.usingSlice ? 'outline-2 outline-solid outline-blue-600' : ''
	]
}
</script>
<template>
	<div class="flex justify-stretch items-center gap-x-2">
		<button type="button"
				class="disabled:opacity-50"
				:class="sliceClass()"
				:disabled="!media?.hasMedia"
				@click="setSliceMode">✂</button>
	</div>
</template>