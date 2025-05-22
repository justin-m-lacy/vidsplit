<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useSnapshot } from '@/store/snapshot';
import { SliceTool } from '@/tools/slice';
import { MediaState } from '@/view/composables/media-state';
import { Camera } from 'lucide-vue-next';

const props = defineProps<{
	media?: MediaState
}>();

const tools = useEditTool();

function doScreenshot() {

	const screenshots = useSnapshot();

}

function setSliceMode() {

	if (!props.media?.hasMedia) return;
	tools.toggleTool(SliceTool, props.media);
}

function sliceClass() {
	return [
		tools.usingSlice ? 'bg-amber-500/40 border border-amber-700' : ''
	]
}
</script>
<template>
	<div class="flex justify-center items-center gap-x-2">
		<button type="button" title="Screenshot"
				class="disabled:opacity-50 text-sm"
				:disabled="!media?.hasMedia"
				@click="doScreenshot">
			<Camera />
		</button>
		<button type="button"
				class="flex justify-center disabled:opacity-50 p-0.5 text-sm"
				:class="sliceClass()"
				:disabled="!media?.hasMedia"
				@click="setSliceMode">✂</button>
	</div>
</template>