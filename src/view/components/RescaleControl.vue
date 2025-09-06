<script setup lang="ts">
import { TResolution } from 'shared/edits';

const props = defineProps<{
	/// actual video resolution
	size:TResolution
}>();

const model = defineModel<TResolution|undefined>({ required: true });
const editing = shallowRef<boolean>(false);

const width = computed({
	get() { return model.value?.width ?? props.size.width },
	set(v: number) {
		model.value = {
			width:v,
			height:model.value?.height??props.size.height
		}
	}
});

const height = computed({
	get() { return model.value?.height ?? props.size.height},
	set(v: number) {
		model.value = {
			width:model.value?.width??props.size.width,
			height:v,
			
		}
	}
});

</script>

<template>
	<div v-if="editing" class="flex text-sm gap-x-2">
		<input id="res-w" class="w-14" type="number" min=0 v-model="width" title="width">
		<span>x</span>
		<input id="res-h" class="w-14" type="number" min=0 v-model="height" title="height">
	</div>
	<div v-else class="flex text-xs" @click="editing=true">
		{{width}}&nbsp;x&nbsp;{{height}}
	</div>
</template>