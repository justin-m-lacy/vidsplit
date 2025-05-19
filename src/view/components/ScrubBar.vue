<script setup lang="ts">
import { createScrubPct, TMediaInfo, TrackPoint } from '@/model/media';


const props = defineProps<{
	media: TMediaInfo
}>();

const scrubs = shallowRef<TrackPoint[]>();

const curDrag = shallowRef<TrackPoint | null>(null);

function getClickPct(e: MouseEvent) {
	const rect = (e.target as HTMLDivElement).getBoundingClientRect();
	return (e.clientX - rect.left) / rect.width;
}

function onClick(e: MouseEvent) {
	createScrubPct(props.media, getClickPct(e));
}

/**
 * Get style position for time.
 * @param t 
 */
function getPos(p: TrackPoint) {
	return {
		left: 100 * (p.at / props.media.duration) + '%'
	}
}

function updatePos(e: MouseEvent, p?: TrackPoint | null) {
	if (p) {
		p.at = getClickPct(e) * props.media.duration;
	}
}

function onDragStart(s: TrackPoint) {
	curDrag.value = s;
}
function onDrag(e: DragEvent) {
	updatePos(e, curDrag.value);
}
function onDragEnd(e: DragEvent) {
	updatePos(e, curDrag.value);
	curDrag.value = null;
}
</script>
<template>
	<div class="w-full min-h-4 p-0 relative bg-green-700" @click="onClick">

		<Scrub v-for="s in scrubs" class="absolute" :key="s.id"
			   draggable
			   :style="getPos(s)"
			   @dragstart="onDragStart(s)"
			   @drag="onDrag"
			   @dragend="onDragEnd" />

	</div>
</template>