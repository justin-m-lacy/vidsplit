<script setup lang="ts">
import { pctRangeToPos, pctToPos } from '@/util/view';
import TimeStamp from '@/view/components/Timestamp.vue';
import { useRangeDrag } from '@/view/composables/range-drag';
import { formatTime } from '../../../shared/time';
import ViewSize from '../components/ViewSize.vue';
import { MediaState } from '../composables/media-state';
import { useTimeline } from '../composables/timeline';
const props = defineProps<{
	media: MediaState
}>();

const barElm = shallowRef<HTMLElement>();
const scrubElm = shallowRef<HTMLElement>();
const fromElm = shallowRef<HTMLElement>();
const toElm = shallowRef<HTMLElement>();


const tl = useTimeline(props.media, scrubElm, barElm);
const { scrubPct, toBarPct } = tl;
useRangeDrag({
	tl, fromElm, toElm, onDragged: (el, pct, tl) => {
		if (el == fromElm.value) {
			tl.media.fromPct = pct;
		} else if (el == toElm.value) {
			tl.media.toPct = pct;
		}
	}
});

</script>
<template>

	<div class="flex justify-stretch items-center select-none
	text-xxs min-h-5">
		<TimeStamp :time="media.time ?? 0" class="text-xxs pr-4" />
		<div ref="barElm"
			 class="relative flex grow items-center box-content
			pointer-events-auto min-h-2 outline outline-orange-700/50 bg-orange-200">

			<div id="blueBarFill"
				 class="absolute h-full bg-sky-200/90
				select-none pointer-events-none"
				 :style="pctRangeToPos(toBarPct(media.fromPct), toBarPct(media.toPct))">

			</div>
			<div class="absolute bg-green-500/75 h-full
				select-none pointer-events-none"
				 :style="pctRangeToPos(toBarPct(media.fromPct), scrubPct)"></div>

			<slot name="overlay" :timeline="tl">&nbsp;</slot>

			<div ref="fromElm"
				 class="absolute z-10 w-3 h-5 min-h-4
				 rounded-l-full rounded-r-none -translate-x-full
			 	border border-amber-800 bg-amber-500/55 shadow-sm"
				 :style="pctToPos(toBarPct(media.fromPct))">
			</div>

			<div ref="toElm"
				 class="absolute z-10 w-3 h-5 min-h-4 rounded-r-full rounded-l-none
			 	border border-amber-800 bg-amber-500/55 shadow-sm"
				 :style="pctToPos(toBarPct(media.toPct))"></div>

			<div ref="scrubElm" class="absolute w-[1px] h-4 min-h-4 -translate-x-1/2
			border border-slate-700/70 bg-slate-400 rounded-xs shadow-sm"
				 :style="pctToPos(scrubPct)">&nbsp;</div>

			<div class="absolute w-full h-full pointer-events-none
			border-none" :style="{
				backgroundImage: `repeating-linear-gradient( 90deg,
				#00000077,
				transparent 1px,
				transparent 15px )`
			}"></div>
		</div>
		<TimeStamp class="pl-4 text-xxs"
				   :time="media.duration ?? 0" hide-ms
				   :title="media.duration ? formatTime(media.duration) : '00:00'" />
		<ViewSize :timeline="tl" />
	</div>

</template>