<script setup lang="ts">
import { useOptions } from '@/store/options-store';
import CodecSelect from '@/view/components/CodecSelect.vue';

const opts = useOptions();

const emits = defineEmits<{
	(e: 'close'): void
}>();
const framePerfect = computed({
	get: () => opts.store.video?.framePerfect ?? false,
	set(v) {

		opts.store.video ??= {};
		opts.store.video.framePerfect = v;
	}
})
const codec = computed({

	get() { return opts.store.video?.codec ?? 'default' },
	set(v) {
		opts.store.video ??= {};
		opts.store.video.codec = v == 'default' ? undefined : v;
	}

});
</script>
<template>

	<div class="flex flex-col items-center min-w-96 grow max-h-8/12
	border border-blue-950/80 rounded-lg p-2">

		<button type="button" class="icon-btn self-end text-lg"
				@click="emits('close')">❌</button>
		<section class="flex flex-col gap-y-3 p-1">
			<h3 class="select-none font-semibold">Video</h3>
			<div class="flex items-center gap-x-2 text-sm font-semibold">
				<input type="checkbox" v-model="framePerfect"
					   title="Frame Perfect Video Slices">
				<label>Frame-Perfect Cuts</label>
			</div>
			<CodecSelect v-model="codec"
						 :codecs="opts.codecs"
						 label="Video Codec" />
		</section>

	</div>
</template>