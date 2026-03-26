<script setup lang="ts">

import { useAppState } from '@/store/app-state';

const store = useAppState();

</script>
<template>
	<div v-if="!store.ffmpegVers" class="flex flex-col shrink text-sm gap-y-1">

		<div class="text-sm font-semibold">FFMpeg not found. Video Editing not available.</div>
		<div class="flex justify-evenly">
			<button v-if="!store.installingFFMpeg" class="btn space-x-1"
					@click="store.installFFMpeg()">
				Install FFMPEG
			</button>
			<button v-else class="btn space-x-1 px-2">
				<span class="">Installing</span>
				<span class="busy"></span>
			</button>
			<button v-if="!store.checkingFFMpeg"
					class="btn"
					@click="store.checkFFMpeg()">Recheck</button>
			<button v-else class="btn space-x-1 px-2">
				<span>Checking FFMpeg</span>
				<span class="busy"></span>
			</button>
		</div>

	</div>
	<div v-else-if="store.ffmpegVers" class="flex justify-start text-xxs font-semibold">
		ffmpeg: {{ store.ffmpegVers }}
	</div>
</template>