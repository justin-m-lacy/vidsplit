<script setup lang="ts">
import { TMediaInfo } from '@/model/media';
import { useEditMode } from '@/store/edit-mode';
import { SliceMode } from '@/tools/slice';

const props = defineProps<{
	media?: TMediaInfo
}>();

const modes = useEditMode();

function setSliceMode() {
	modes.setMode(SliceMode);
}

</script>
<template>
	<button type="button" class=""
			@click="setSliceMode">✂</button>

</template>