<script setup lang="ts">
import { MediaCut } from '@/tools/cut';
import { pctRangeToPos } from '@/util/view';
import SplitPoint from '@/view/components/SplitPoint.vue';
import { useRangeDrag } from '@/view/composables/range-drag';
import { Timeline } from '@/view/composables/timeline';

const props = defineProps<{
	cut: MediaCut,
	timeline: Timeline
}>();

const fromElm = shallowRef<HTMLElement>();
const toElm = shallowRef<HTMLElement>();

useRangeDrag({
	tl: props.timeline, fromElm, toElm, onDragged: (elm, pct, tl) => {

		if (elm == fromElm.value) {
			props.cut.from = pct * tl.media.duration;
		} else {
			props.cut.to = pct * tl.media.duration;
		}

	}
});

</script>
<template>
	<div class="h-3 absolute overflow-visible" :style="{
		//bg-[repeating-linear-gradient(45deg,_#ea391ecc_0,_#e1e1e1_1px,_transparent_0,_transparent_50%)] bg-[size:10px_10px]
		background:
			'repeating-linear-gradient( -45deg, #dd170dbb 0 8px, #ea391e63  8px 16px)',
		...pctRangeToPos(timeline.timeToPct(cut.from), timeline.timeToPct(cut.to))
	}">
		<SplitPoint ref="fromElm"
					class="absolute h-6 left-0
			-translate-x-1/2 -translate-y-1/4 shadow-sm" />
		<SplitPoint ref="toElm"
					class="absolute h-6 right-0 translate-x-1/2 -translate-y-1/4 shadow-sm" />

	</div>
</template>