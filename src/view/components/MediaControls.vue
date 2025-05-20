<script setup lang="ts">
import { MediaState } from '@/view/composables/media-state';
import { Pause, Play, Repeat } from 'lucide-vue-next';

const props = defineProps<{
	state: MediaState,
}>();

const doPlay = () => {
	props.state.playing = true;
}
const doStop = () => {
	props.state.time = 0;
	props.state.paused = true;
}
const doPause = () => {
	props.state.paused = true;
}
const toggleLoop = () => {
	props.state.loop = !props.state.loop;
}
</script>
<template>
	<div class="flex flex-wrap items-center gap-x-1 select-none">
		<button type="button" @click="doPlay" class="disabled:opacity-50"
				:disabled="state.playing || !state.hasMedia">
			<Play class="fill-gray-600 stroke-1 w-5" />
		</button>
		<button type="button"
				class="bg-gray-600 w-4 h-4 border-1 border-black disabled:opacity-50"
				@click="doStop"
				:disabled="!state.playing">
			&nbsp;
		</button>
		<button type="button" @click="doPause" class="disabled:opacity-50"
				:disabled="!state.playing">
			<Pause class="fill-gray-600 stroke-1"></Pause>
		</button>
		<button type="button" @click="toggleLoop"
				:class="[
					state.loop ? 'outline-solid outline-2 outline-blue-700' : 'outline-none',
					'p-0',
					'disabled:opacity-50'
				]">
			<Repeat class=" stroke-2 w-5" />
		</button>
		<slot></slot>
	</div>
</template>