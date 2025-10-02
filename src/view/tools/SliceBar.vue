<script setup lang="ts">
import { SliceEdit } from '@/tools/slice';
import { useSliceDrag } from '@/view/composables/slice-drag';
import ViewSize from '../components/ViewSize.vue';
import { MediaState } from '../composables/media-state';
import { useTimeline } from '../composables/timeline';

const props = defineProps<{
	edit: SliceEdit,
	media: MediaState
}>();

const barElm = shallowRef<HTMLElement>();
const scrubElm = shallowRef<HTMLElement>();
const fromElm = shallowRef<HTMLElement>();
const toElm = shallowRef<HTMLElement>();

const tl = useTimeline(props.media, scrubElm, barElm);
const { scrubPct, toBarPct } = tl;
useSliceDrag(tl, fromElm, toElm);

/**
 * fill bar of active range.
 * @param from
 * @param to 
 */
const fillStyle = (from: number, to: number) => {
	return {
		left: `${100 * from}%`,
		right: `${100 * (1 - to)}%`
	}
}

/**
 * Get style position for time.
 * @param t 
 */
function getPos(pct: number) {
	return {
		left: `${100 * pct}%`
	}
}
</script>
<template>

	<div class="flex justify-stretch w-full items-center select-none
	text-xxs gap-x-2 min-h-5">
		<div ref="barElm"
			 class="relative flex items-center w-full grow min-h-2 border border-l-0 border-r-0 
			 border-red-500 bg-red-200 bg-repeat-x">

			<div class="absolute min-h-2 h-2 bg-sky-200/90
				select-none pointer-events-none"
				 :style="fillStyle(toBarPct(media.fromPct), toBarPct(media.toPct))">

			</div>
			<div class="absolute bg-green-500/75 min-h-2 h-2
				select-none pointer-events-none"
				 :style="fillStyle(toBarPct(media.fromPct), scrubPct)"></div>

			<div ref="fromElm"
				 class="absolute z-10 w-3 h-5 min-h-4
				 rounded-l-full rounded-r-none -translate-x-full
			 	border border-amber-800 bg-amber-500/55 shadow-sm"
				 :style="getPos(toBarPct(media.fromPct))">
			</div>

			<div ref="toElm"
				 class="absolute z-10 w-3 h-5 min-h-4 rounded-r-full rounded-l-none
			 	border border-amber-800 bg-amber-500/55 shadow-sm"
				 :style="getPos(toBarPct(media.toPct))"></div>

			<div ref="scrubElm" class="absolute w-[1px] h-4 min-h-4 -translate-x-1/2
			border border-slate-700/70 bg-slate-400 rounded-xs shadow-sm"
				 :style="getPos(scrubPct)">&nbsp;</div>

			<div class="absolute w-full h-full pointer-events-none
			border-l border-r border-red-500" :style="{
				backgroundImage: `repeating-linear-gradient( 90deg,
				#00000077,
				transparent 1px,
				transparent 15px )`
			}">
			</div>
		</div>
		<ViewSize :timeline="tl" />
	</div>

</template>