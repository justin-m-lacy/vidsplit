<script setup lang="ts">
import { useTimeline } from '@/view/composables/timeline';
import Timestamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';
import ViewSize from './ViewSize.vue';
const props = defineProps<{
	media: MediaState
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const tl = useTimeline(props.media, scrubRef, barRef);

</script>
<template>
	<div class="flex items-center gap-x-1 text-xs">
		<Timestamp :time="media.time ?? 0" class="text-xxs" />
		<div ref="barRef" id="scrubBar"
			 class="flex items-center w-full min-h-[6px] relative bg-green-500 border-green-800 select-none">

			<div ref="scrubRef" class="absolute h-4 min-h-4 -translate-x-1/2
			bg-slate-500 rounded-xs select-none"
				 :style="{ left: `${100 * tl.scrubPct.value}%` }">&nbsp;</div>

		</div>
		<ViewSize :timeline="tl" class="text-xxs" />
	</div>
</template>