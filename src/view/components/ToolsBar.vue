<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { SliceTool } from '@/tools/slice';

const props = defineProps<{
	media?: HTMLMediaElement
}>();

const tools = useEditTool();

function setSliceMode() {

	if (props.media) {
		tools.beginEdit(SliceTool, props.media);
	}

}

function sliceClass() {
	return {
		'outline-1': tools.tool?.id === 'slice'
	}
}
</script>
<template>
	<button type="button"
			:class="sliceClass()"
			@click="setSliceMode">✂</button>

</template>