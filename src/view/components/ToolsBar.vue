<script setup lang="ts">
import { TMediaInfo } from '@/model/media';
import { useEditTool } from '@/store/edit-tool';
import { SliceTool } from '@/tools/slice';

const props = defineProps<{
	media?: TMediaInfo
}>();

const modes = useEditTool();

function setSliceMode() {
	modes.setMode(SliceTool);
}

</script>
<template>
	<button type="button" class=""
			@click="setSliceMode">✂</button>

</template>