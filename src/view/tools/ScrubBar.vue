<script setup lang="ts">
import ViewSize from '@/view/components/ViewSize.vue';
import { useTimeline } from '@/view/composables/timeline';
import Timestamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';

const props = defineProps<{
	media: MediaState
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const tl = useTimeline(props.media, scrubRef, barRef);

</script>
<template>
	<div class="flex items-center gap-x-1 text-xs w-full">
		<Timestamp :time="media.time ?? 0" class="text-xxs" />
		<div ref="barRef" id="scrubBar"
			 class="flex items-center w-full min-h-2 relative border bg-sky-200 border-sky-700 select-none">

			<div class="absolute bg-green-500/75 h-full left-0
				pointer-events-none select-none"
				 :style="{
					width: `${100 * tl.scrubPct.value}%`
				}">&nbsp;</div>

			<div ref="scrubRef" class="absolute w-[1px] h-4 min-h-4 -translate-x-1/2
			bg-slate-500/80 rounded-xs select-none"
				 :style="{ left: `${100 * tl.scrubPct.value}%` }">&nbsp;</div>

			<div class="absolute w-full h-full pointer-events-none" :style="{
				backgroundImage: `repeating-linear-gradient( 90deg,
				#00000077,
				transparent 1px,
				transparent 15px )`
			}">
			</div>
		</div>
		<ViewSize :timeline="tl" class="text-xxs" />
	</div>
</template>