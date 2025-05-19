<script setup lang="ts">
import { SliceEdit } from '@/tools/slice';
import { getClickPct, mediaReady } from '@/util/view';
import Scrub from '@/view/components/Scrub.vue';
import { useSliceDrag } from '@/view/composables/slice-drag';

const props = defineProps<{
	edit: SliceEdit,
	media: HTMLMediaElement
}>();

const barElm = shallowRef<HTMLElement>();
const leftElm = shallowRef<HTMLElement>();
const rightElm = shallowRef<HTMLElement>();

const dragging = useSliceDrag(props.edit, leftElm, rightElm, barElm);

function onClick(e: MouseEvent) {

	if (mediaReady(props.media)) {
		const pct = getClickPct(e);
		props.media.fastSeek(pct * props.media.duration);
	}

}

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
	<div ref="barElm" class="w-full min-h-4 p-0 relative bg-green-700" @click="onClick">

		<Scrub ref="leftElm" class="absolute"
			   draggable
			   :style="getPos(edit.leftPct.value)" />

		<Scrub ref="rightElm" class="absolute"
			   draggable
			   :style="getPos(edit.rightPct.value)" />

	</div>
</template>