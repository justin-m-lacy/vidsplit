<script setup lang="ts">
import { TResolution } from 'shared/edits';


const model = defineModel<TResolution>({ required: true });

const width = computed({

	get() {
		return model.value.width
	},
	set(v: number) {
		model.value.width = v;
	}
});

const height = computed({

	get() {
		return model.value.height
	},
	set(v: number) {
		model.value.height = v;
	}
});

</script>

<template>
	<div class="flex">
		<input id="res-w" type="number" v-model="width" title="width">
		<span>x</span>
		<input id="res-h" type="number" v-model="height" title="height">
	</div>
</template>