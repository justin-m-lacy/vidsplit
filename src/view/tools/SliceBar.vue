<script setup lang="ts">
import { SliceEdit } from '@/tools/slice';
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

	<div ref="barElm" class="relative flex items-center w-full min-h-1 border border-red-700 bg-red-500">

		<div class=" absolute min-h-2 h-2 bg-green-500 select-none pointer-events-none "
			 :style="fillStyle(edit.fromPct.value, edit.toPct.value)">
		</div>

		<div ref="fromElm"
			 class="absolute z-10 w-2 h-4 min-h-4 rounded-xs -translate-x-1/2
			 	border border-slate-800 bg-amber-500 shadow-sm"
			 :style="getPos(edit.fromPct.value)"></div>

		<div ref="toElm"
			 class="absolute z-10 w-2 h-4 min-h-4 rounded-xs -translate-x-1/2
			 	border border-slate-800 bg-amber-500 shadow-sm"
			 :style="getPos(edit.toPct.value)"></div>

		<div ref="scrubElm" class="absolute w-2 h-4 min-h-4 -translate-x-1/2
			border border-slate-800 bg-slate-400 rounded-xs shadow-sm"
			 :style="{ left: `${percent}%` }">&nbsp;</div>


	</div>

</template>