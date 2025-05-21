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
const scrubElm = shallowRef<HTMLElement>();
const fromElm = shallowRef<HTMLElement>();
const toElm = shallowRef<HTMLElement>();

const { percent } = useScrubBar(() => props.media, scrubElm, barElm);
useSliceDrag(props.edit, fromElm, toElm, barElm);

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

	<div ref="barElm" class="relative flex items-center w-full min-h-2 bg-green-500">

		<Scrub ref="scrubElm" class="absolute h-4 min-h-4 bg-slate-500 rounded-xs"
			   :style="{ left: `${percent}%` }" />

		<div ref="fromElm"
			 class="absolute w-2 h-4 min-h-4 rounded-xs bg-amber-700"
			 :style="getPos(edit.fromPct.value)"></div>

		<div ref="toElm"
			 class="absolute w-2 h-4 min-h-4 rounded-xs bg-amber-700"
			 :style="getPos(edit.toPct.value)"></div>

	</div>

</template>