<script setup lang="ts">
import ViewSize from '@/view/components/ViewSize.vue';
import { useTimeline } from '@/view/composables/timeline';
import { formatTime } from '../../../shared/time';
import TimeStamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';

const props = defineProps<{
	media: MediaState
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const tl = useTimeline(props.media, scrubRef, barRef);

</script>
<template>
	<div class="flex w-full justify-center items-stretch select-none h-4 min-h-4 gap-x-1 text-xxs">
		<TimeStamp :time="media.time ?? 0" />
		<div ref="barRef"
			 class="relative flex grow items-center border bg-sky-200 border-sky-700">

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
		<TimeStamp :time="media.duration ?? 0" hide-ms
				   :title="media.duration ? formatTime(media.duration) : '00:00'" />
		<ViewSize :timeline="tl" />
	</div>
</template>