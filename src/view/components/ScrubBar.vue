<script setup lang="ts">
import { useScrubBar } from '@/view/composables/scrub-bar';
import Timestamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';
const props = defineProps<{
	media: MediaState
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const { scrubPct } = useScrubBar(props.media, scrubRef, barRef);

</script>
<template>
	<div class="flex items-center gap-x-1">
		<Timestamp :time="media.time ?? 0" class="text-[0.6rem]" />
		<div ref="barRef" id="scrubBar"
			 class="flex items-center w-full min-h-[6px] relative bg-green-500 border-green-800 select-none">

			<div ref="scrubRef" class="absolute h-4 min-h-4 -translate-x-1/2
			bg-slate-500 rounded-xs select-none"
				 :style="{ left: `${scrubPct}%` }">&nbsp;</div>

		</div>
	</div>
</template>