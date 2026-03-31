<script setup lang="ts">
import { MediaState } from '@/view/composables/media-state';
import { Pause, Play, Repeat } from 'lucide-vue-next';
import VolumeCtrl from './VolumeCtrl.vue';

defineProps<{
	state: MediaState,
}>();

</script>
<template>
	<div class="flex flex-wrap justify-center items-center gap-x-1 select-none">

		<button type="button" @click="state.play()" title="Play"
				class="icon-btn"
				:disabled="state.playing || !state.ready">
			<Play class="fill-gray-600 stroke-1 w-5" />
		</button>
		<button type="button" title="Stop"
				class="icon-btn bg-gray-600 w-4 h-4 border-1 border-black"
				@click="state.stop()"
				:disabled="!state.playing">
			&nbsp;
		</button>
		<button type="button" @click="state.pause()" title="Pause"
				class="icon-btn"
				:disabled="!state.playing">
			<Pause class="fill-gray-600 stroke-1"></Pause>
		</button>
		<button type="button" @click="state.loop = !state.loop" title="Loop Playback"
				:class="[
					'icon-btn',
					state.loop ? 'bg-blue-300/80' : 'bg-none',
					'transition-colors p-0.5 rounded-md',
					'disabled:opacity-50'
				]">
			<Repeat class="px-0 py-0 w-5" />
		</button>

		<slot></slot>
		<VolumeCtrl class="ml-4" v-model="state.volume"
					v-model:muted="state.muted" />

	</div>
</template>