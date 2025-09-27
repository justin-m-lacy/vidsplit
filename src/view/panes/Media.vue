<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useMediaStore } from '@/store/media-store';
import { IsSliceEdit } from '@/tools/slice';
import { useMediaState } from '@/view/composables/media-state';
import { Upload } from 'lucide-vue-next';
import MediaControls from '../components/MediaControls.vue';
import ScrubBar from '../components/ScrubBar.vue';
import ToolsBar from '../components/ToolsBar.vue';
import SliceTools from '../tools/SliceTools.vue';

const videoElm = shallowRef<HTMLVideoElement>();

const mediaStore = useMediaStore();

const fileInput = shallowRef<HTMLInputElement>();

const tools = useEditTool();

const mediaState = useMediaState(videoElm);

onMounted(() => {
	if (tools.tool == null) {
		tools.setSliceMode(mediaState);
	}
})

async function loadFile(files: FileList) {
	try {

		const file = files.item(0)!;
		mediaState.file = file;

		mediaStore.setSource(file);

	} catch (err) {
		console.error(err);
	}
}

function fileDrop(e: DragEvent) {

	const files = e.dataTransfer?.files;
	if (files) {
		loadFile(files);
	}

}
const fileDrag = (e: DragEvent) => {
	e.preventDefault();
	e.dataTransfer!.dropEffect = 'copy';
}

async function onFilePicked(event: Event) {

	try {

		const files = (event.target as HTMLInputElement).files;
		if (files) {
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
	<div class="flex flex-col items-stretch m-1 gap-y-2 w-3/5">
		<div class="self-center relative m-1 border border-black w-full"
			 @drop.prevent="fileDrop" @dragover="fileDrag">
			<video ref="videoElm" class="w-full h-full"
				   autoplay :controls="false"
				   :src="mediaStore.sourceUrl">
			</video>
			<div v-if="!mediaStore.sourceUrl"
				 class="absolute top-0 left-0
				 	w-full h-full flex justify-center items-center"
				 @click.prevent="fileInput?.click()">
				<Upload />
			</div>
		</div>
		<MediaControls :state="mediaState"
					   class="flex items-center w-full mx-4">
			<ToolsBar :media="mediaState" class="ml-3" />
			<button type="button" class="btn" id="drop-file" title="Load Media"
					@click.stop.prevent="fileInput?.click()"
					@drop.prevent="fileDrop" @dragover="fileDrag"
					name="[Load]">
				<Upload />
			</button>
		</MediaControls>
		<div class="flex gap-x-0.5 items-center justify-center">

			<SliceTools v-if="IsSliceEdit(tools.curEdit)"
						class="flex items-center grow rounded-md w-4/6 max-w-4/6"
						:edit="tools.curEdit"
						:media="mediaState" />

			<ScrubBar v-else-if="videoElm"
					  class="flex items-center grow max-w-4/6 w-4/6"
					  :media="mediaState" />

		</div>
		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFilePicked">
	</div>
</template>