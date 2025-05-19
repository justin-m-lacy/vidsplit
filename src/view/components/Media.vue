<script setup lang="ts">
import { createMediaInfo, TMediaInfo } from '@/model/media';
import ToolsBar from '@/view/components/ToolsBar.vue';
import ScrubBar from './ScrubBar.vue';

const mediaRef = shallowRef<HTMLMediaElement>();
const mediaInfo = shallowRef<TMediaInfo>();

const sourceUrl = shallowRef<string>();

const fileInput = ref<HTMLInputElement>();

function onMetadata(e: Event) {

	const targ = e.target as HTMLMediaElement;
	if (!targ) return;
	const cur = mediaInfo.value;

	if (cur && cur.src === targ.src) {
		cur.duration = targ.duration;
	} else {
		mediaInfo.value = createMediaInfo(targ);
	}

}

async function loadFile(files: FileList) {
	try {

		if (files.length > 0) {
			sourceUrl.value = URL.createObjectURL(files.item(0)!);
		}

	}
	catch (err) {
		console.error(err);
	}
}

function fileDrop(e: DragEvent) {

	const files = e.dataTransfer?.files;
	if (files && files.length > 0) {
		loadFile(files);
	}

}
const fileDrag = (e: DragEvent) => {
	e.preventDefault();
	e.dataTransfer!.dropEffect = 'copy';
}

async function onFileSelected(event: Event) {

	try {

		const files = (event.target as HTMLInputElement).files;
		if (files && files.length > 0) {
			await loadFile(files);
		}

	} catch (err) {
		console.error(err);
	} finally {
		(event.target as HTMLInputElement).value = '';
	}

}

</script>
<template>
	<div class="flex flex-col">
		<video ref="mediaRef" class="min-w-72" autoplay controls
			   :src="sourceUrl"
			   @loadedmetadata="onMetadata"
			   @drop.prevent="fileDrop" @dragover="fileDrag"></video>
		<ToolsBar :media="mediaInfo" />
		<div class="flex">
			<ScrubBar v-if="mediaInfo" class="flex grow"
					  :media="mediaInfo" />
			<button type="button" class="btn" id="drop-file"
					@click.stop.prevent="fileInput?.click()"
					@drop.prevent="fileDrop" @dragover="fileDrag"
					name="[Load]">💾</button>
		</div>
		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFileSelected">
	</div>
</template>