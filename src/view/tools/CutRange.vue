<script setup lang="ts">
import { MediaCut } from '@/tools/cut';
import { pctRangeToPos } from '@/util/view';
import { useRangeDrag } from '@/view/composables/range-drag';
import { Timeline } from '@/view/composables/timeline';

const props = defineProps<{
	cut: MediaCut,
	timeline: Timeline
}>();

const fromElm = shallowRef<HTMLElement>();
const toElm = shallowRef<HTMLElement>();

function onDragged(elm: HTMLElement, pct: number) {

}
useRangeDrag({ tl: props.timeline, fromElm, toElm, onDragged });

</script>
<template>
	<div class="h-3.5 absolute" :style="{
		//bg-[repeating-linear-gradient(45deg,_#ea391ecc_0,_#e1e1e1_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]
		background:
			'repeating-linear-gradient( -45deg, #dd170dbb 0 8px, #ea391e63  8px 16px)',
		...pctRangeToPos(timeline.timeToPct(cut.from), timeline.timeToPct(cut.to))
	}">
		<div ref="fromElm"
			 class="absolute h-6 -translate-y-1/4 w-1 bg-red-800/80 left-0 -translate-x-full shadow-sm">
		</div>
		<div ref="endElm"
			 class="absolute h-6 w-1 right-0 translate-x-full bg-red-800/80 shadow-sm">
		</div>
	</div>
</template>