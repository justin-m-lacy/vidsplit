<script setup lang="ts">
import { useScrubBar } from '@/view/composables/scrub-bar';
import Timestamp from '../components/Timestamp.vue';
const props = defineProps<{
	media: HTMLMediaElement | undefined
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const { percent } = useScrubBar(() => props.media, scrubRef, barRef);

</script>
<template>
	<div class="flex items-center gap-x-1">
		<Timestamp :time="media?.currentTime ?? 0" class="text-[0.6rem]" />
		<div ref="barRef" id="scrubBar"
			 class="flex items-center w-full min-h-[6px] relative bg-green-500 border-green-800 select-none">

			<div ref="scrubRef" class="absolute h-4 min-h-4 -translate-x-1/2
			bg-slate-500 rounded-xs select-none"
				 :style="{ left: `${percent}%` }">&nbsp;</div>

		</div>
	</div>
</template>