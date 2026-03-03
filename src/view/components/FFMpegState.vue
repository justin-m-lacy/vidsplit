<script setup lang="ts">

import { useAppState } from '@/store/app-state';

const store = useAppState();

</script>
<template>
	<div v-if="!store.ffmpegVers" class="flex flex-col">

		<div class="text-sm font-bold">FFMpeg not found. Video Editing not available.</div>
		<div class="flex">
			<button v-if="!store.installingFFMpeg" class="" @click="store.installFFMpeg()">
				Install FFMPeg

			</button>
			<button v-else>
				<span>Installing</span>
				<span class="busy"></span>
			</button>
			<button class="" v-if="!store.checkingFFMpeg"
					@click="store.checkFFMpeg()">Recheck</button>
			<button v-else>
				<span>Checking FFMpeg</span>
				<span class="busy"></span>
			</button>
		</div>

	</div>
	<div v-else-if="store.ffmpegVers" class="text-xs">
		ffmpeg: {{ store.ffmpegVers }}
	</div>
</template>