<script setup lang="ts">

import { useAppState } from '@/store/app-state';

const store = useAppState();

</script>
<template>
	<div v-if="!store.ffmpegVers || true" class="flex flex-col text-sm space-y-1">

		<div class="text-sm font-semibold">FFMpeg not found. Video Editing not available.</div>
		<div class="flex justify-evenly">
			<button v-if="!store.installingFFMpeg"
					class="btn"
					@click="store.installFFMpeg()">
				Install FFMPEG

			</button>
			<button v-else class="btn">
				<span>Installing</span>
				<span class="busy"></span>
			</button>
			<button v-if="!store.checkingFFMpeg"
					class="btn"
					@click="store.checkFFMpeg()">Recheck</button>
			<button v-else class="btn">
				<span>Checking FFMpeg</span>
				<span class="busy"></span>
			</button>
		</div>

	</div>
	<div v-else-if="store.ffmpegVers" class="btn">
		ffmpeg: {{ store.ffmpegVers }}
	</div>
</template>