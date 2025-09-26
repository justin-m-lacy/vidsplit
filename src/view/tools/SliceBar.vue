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
useSliceDrag(props.media, fromElm, toElm, barElm);

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

	<div class="flex justify-stretch w-full items-center text-xxs gap-x-2">
		<div ref="barElm" class="relative flex items-center w-full grow min-h-1 border border-red-700 bg-red-500">

			<div class=" absolute min-h-2 h-2 bg-sky-200 select-none pointer-events-none "
				 :style="fillStyle(toBarPct(media.fromPct), toBarPct(media.toPct))">

			</div>
			<div class="absolute bg-green-500 left-0 min-h-2 h-2
				pointer-events-none select-none"
				 :style="fillStyle(toBarPct(media.fromPct), tl.scrubPct.value)">&nbsp;</div>

			<div ref="fromElm"
				 class="absolute z-10 w-2 h-5 min-h-4
				 rounded-l-full rounded-r-none -translate-x-full
			 	border border-slate-800 bg-amber-500 shadow-sm"
				 :style="getPos(toBarPct(media.fromPct))">
			</div>

			<div ref="toElm"
				 class="absolute z-10 w-2 h-5 min-h-4 rounded-r-full rounded-l-none
			 	border border-slate-800 bg-amber-500 shadow-sm"
				 :style="getPos(toBarPct(media.toPct))"></div>

			<div ref="scrubElm" class="absolute w-2 h-4 min-h-4 -translate-x-1/2
			border border-slate-800 bg-slate-400 rounded-xs shadow-sm"
				 :style="getPos(scrubPct)">&nbsp;</div>


		</div>
		<ViewSize :timeline="tl" />
	</div>

</template>