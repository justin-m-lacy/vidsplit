<script setup lang="ts">
import { createScrubPct, TrackPoint } from '@/model/media';
import { getClickPct, mediaReady } from '@/util/view';

const props = defineProps<{
	media: HTMLMediaElement
}>();

const barRef = shallowRef<HTMLElement>();
const scrubStart = shallowRef<TrackPoint>(createScrubPct(props.media, 0));
const scrubEnd = shallowRef<TrackPoint>(createScrubPct(props.media, 1));

const curDrag = shallowRef<TrackPoint | null>(null);

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
	<div ref="barRef" class="w-full min-h-4 p-0 relative bg-green-700" @click="onClick">

		<Scrub class="absolute" :key="scrubStart.id"
			   draggable
			   :style="getPos(scrubStart)"
			   @dragstart="onDragStart(scrubStart)"
			   @drag="onDrag"
			   @dragend="onDragEnd" />

		<Scrub class="absolute" :key="scrubEnd.id"
			   draggable
			   :style="getPos(scrubEnd)"
			   @dragstart="onDragStart(scrubEnd)"
			   @drag="onDrag"
			   @dragend="onDragEnd" />

	</div>
</template>