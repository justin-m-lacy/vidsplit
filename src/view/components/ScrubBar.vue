<script setup lang="ts">
import { mediaReady } from '@/util/view';
import { useScrubBar } from '@/view/composables/scrub-bar';
import Scrub from '../components/Scrub.vue';

const props = defineProps<{
	media: HTMLMediaElement|undefined
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const scrubs = useScrubBar(()=>props.media, scrubRef, barRef);

function getClickPct(e: MouseEvent) {
	const rect = (e.target as HTMLDivElement).getBoundingClientRect();
	return (e.clientX - rect.left) / rect.width;
}

function onClick(e: MouseEvent) {

	if (props.media && mediaReady(props.media)) {

		if ( Number.isNaN(props.media.duration)) return;

		const pct = getClickPct(e);
		props.media.currentTime = (pct * props.media.duration);

	}

}


</script>
<template>
	<div ref="barRef" class="w-full min-h-3 p-0 relative bg-green-600" @click="onClick">

		<Scrub ref="scrubRef" class="absolute bg-slate-500 rounded-xs" />

	</div>
</template>