<script setup lang="ts">
import { Pause, Play, Repeat } from 'lucide-vue-next';

const props = defineProps<{
	media?: HTMLMediaElement
}>();

const isPlaying = computed(() => {
	const media = props.media;
	return media != null && !media.paused && media.readyState > 1 && !media.ended;
});

const MediaType = HTMLMediaElement;
const doPlay = () => {
	props.media?.play();
}
const doStop = () => {
	if (props.media) {
		props.media.pause();
		props.media.currentTime = 0;
	}
}
const doPause = () => {
	props.media?.pause();
}
const toggleLoop = () => {
	if (props.media) {
		props.media.loop = !props.media.loop;
	}
}
</script>
<template>
	<div class="flex flex-wrap items-center gap-x-1 select-none">
		<button type="button" @click="doPlay"
				:disabled="isPlaying || !media || media.readyState < MediaType.HAVE_CURRENT_DATA">
			<Play class="fill-gray-600 stroke-1 w-5" />
		</button>
		<button type="button"
				class="bg-gray-600 w-4 h-4 border-1 border-black"
				@click="doStop"
				:disabled="!isPlaying">
			&nbsp;
		</button>
		<button type="button" @click="doPause"
				:disabled="!isPlaying">
			<Pause class="fill-gray-600 stroke-1"></Pause>
		</button>
		<button type="button" @click="toggleLoop"
				:class="{
					'outline-2': media?.loop == true
				}">
			<Repeat class=" stroke-2 w-5" />
		</button>
		<slot></slot>
	</div>
</template>