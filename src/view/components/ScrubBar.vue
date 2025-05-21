<script setup lang="ts">
import { useScrubBar } from '@/view/composables/scrub-bar';

const props = defineProps<{
	media: HTMLMediaElement | undefined
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const { percent } = useScrubBar(() => props.media, scrubRef, barRef);

</script>
<template>
	<div ref="barRef" id="scrubBar" class="w-full min-h-[6px] relative bg-green-500 select-none">

		<div ref="scrubRef" class="absolute h-4 min-h-4 bg-slate-500 rounded-xs select-none"
			   :style="{ left: `${percent}%` }">&nbsp;</div>

	</div>
</template>