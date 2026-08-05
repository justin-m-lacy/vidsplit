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

const dragger = useRangeDrag(props.timeline, fromElm, toElm);

</script>
<template>
	<div class="h-4 absolute" :style="{
		//bg-[repeating-linear-gradient(45deg,_#e1e1e1_0,_#e1e1e1_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]
		background:
			'repeating-linear-gradient( 45deg, #ea391e, #ea391e 10px, #dd170d 10px, #dd170d 20px)',
		...pctRangeToPos(timeline.timeToPct(cut.from), timeline.timeToPct(cut.to))
	}">
		<div ref="fromElm"
			 class="absolute h-2 w-2 left-0 -translate-x-full shadow-sm">
		</div>
		<div ref="endElm"
			 class="absolute h-2 w-2 right-0 -translate-x-full shadow-sm">
		</div>
	</div>
</template>