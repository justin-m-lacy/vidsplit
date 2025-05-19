<script setup lang="ts">
const props = defineProps<{
	media: HTMLMediaElement
}>();

const isPlaying = computed(() => {
	const media = props.media;
	return !media.paused && media.readyState > 1 && !media.ended;
});

const MediaType = HTMLMediaElement;
const doPlay = () => {
	props.media.play();
}
const doStop = () => {
	props.media.pause();
	props.media.currentTime = 0;
}
const doPause = () => {
	props.media.pause();
}
const toggleLoop = () => {
	props.media.loop = !props.media.loop;
}
</script>
<template>
	<div class="flex">
		<button type="button" @click="doPlay"
				:disabled="isPlaying || media.readyState < MediaType.HAVE_CURRENT_DATA">⏵</button>
		<button type="button" @click="doStop"
				:disabled="!isPlaying">⏹</button>
		<button type="button" @click="doPause"
				:disabled="!isPlaying">⏸</button>
		<button type="button" @click="toggleLoop">🔁</button>
	</div>
</template>