<script setup lang="ts">
import { SliceEdit } from '@/tools/slice';
import Scrub from '@/view/components/Scrub.vue';
import { useSliceDrag } from '@/view/composables/slice-drag';
import { useScrubBar } from '../composables/scrub-bar';

const props = defineProps<{
	edit: SliceEdit,
	media: HTMLMediaElement | undefined
}>();

const barElm = shallowRef<HTMLElement>();
const scrubRef = shallowRef<HTMLElement>();
const leftElm = shallowRef<HTMLElement>();
const rightElm = shallowRef<HTMLElement>();

const { percent } = useScrubBar(() => props.media, scrubRef, barElm);


const dragging = useSliceDrag(props.edit, leftElm, rightElm, barElm);

/**
 * Get style position for time.
 * @param t 
 */
function getPos(pct: number) {
	return {
		left: 100 * pct + '%'
	}
}
</script>
<template>
	<div ref="barElm" class="w-full min-h-2 p-0 relative bg-green-500">

		<Scrub ref="scrubRef" class="absolute h-3 min-h-3 bg-slate-500 rounded-xs"
			   :style="{ left: `${percent}%` }" />

		<Scrub ref="leftElm" class="absolute h-3 min-h-3 rounded-xs"
			   draggable
			   :style="getPos(edit.leftPct.value)" />

		<Scrub ref="rightElm" class="absolute h-3 min-h-3 rounded-xs"
			   draggable
			   :style="getPos(edit.rightPct.value)" />

	</div>
</template>