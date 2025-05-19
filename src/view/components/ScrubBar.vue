<script setup lang="ts">
import { mediaReady } from '@/util/view';
import { useScrubBar } from '@/view/composables/scrub-bar';
import Scrub from '../components/Scrub.vue';

const props = defineProps<{
	media: HTMLMediaElement
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
		const pct = getClickPct(e);
		props.media.fastSeek(pct * props.media.duration);
	}

}


</script>
<template>
	<div ref="barRef" class="w-full min-h-4 p-0 relative bg-green-700" @click="onClick">

		<Scrub ref="scrubRef" class="absolute" />

	</div>
</template>