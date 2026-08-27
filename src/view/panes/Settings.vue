<script setup lang="ts">
import { useOptions } from '@/store/options-store';

const opts = useOptions();

const emits = defineEmits<{
	(e: 'close'): void
}>();
const framePerfect = computed({
	get: () => opts.slice?.framePerfect ?? false,
	set(v) {

		opts.slice ??= {};
		opts.slice.framePerfect = v;
	}
})
</script>
<template>

	<div class="flex flex-col items-center min-w-96 grow max-h-8/12 gap-y-2
	border border-blue-950/80 rounded-lg p-2">

		<button type="button" class="icon-btn self-end"
				@click="emits('close')">❌</button>
		<section class="flex flex-col gap-y-2 p-1">
			<h3 class="select-none font-semibold">Video Slicing</h3>
			<div class="flex gap-x-1">
				<input type="checkbox" v-model="framePerfect"
					   title="Frame Perfect Video Slices">
				<label>Frame-Perfect Cuts</label>
			</div>
		</section>

	</div>
</template>