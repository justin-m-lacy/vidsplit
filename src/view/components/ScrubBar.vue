<script setup lang="ts">
import { mediaReady } from '@/util/view';
import { usePlayHead } from '../composables/play-head';

const props = defineProps<{
	media: HTMLMediaElement
}>();

const {playTime} = usePlayHead( ()=>props.media );

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

const scrubCss=()=>{
	if ( !props.media ) return '';
	return {
		left:`${100*(playTime.value/props.media.duration)}%`
	}
}

</script>
<template>
	<div class="w-full min-h-4 p-0 relative bg-green-700" @click="onClick">

		<Scrub class="absolute"
			:style="scrubCss()"
		/>

	</div>
</template>