<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useMediaStore } from '@/store/media-store';
import { IsSliceEdit } from '@/tools/slice';
import { useMediaState } from '@/view/composables/media-state';
import SliceScrubBar from '@/view/tools/SliceScrubBar.vue';
import MediaControls from '../components/MediaControls.vue';
import ScrubBar from '../components/ScrubBar.vue';
import ToolsBar from '../components/ToolsBar.vue';

const mediaRef = shallowRef<HTMLMediaElement>();

const mediaStore = useMediaStore();

const fileInput = ref<HTMLInputElement>();

const editMode = useEditTool();

const mediaState = useMediaState(mediaRef);

async function loadFile(files: FileList) {
	try {
		mediaStore.setSource(files.item(0)!);
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
	<div class="flex flex-col items-stretch m-1 gap-y-1">
		<div class="self-center relative min-w-48 w-1/2 m-1"
			 @drop.prevent="fileDrop" @dragover="fileDrag">
			<video ref="mediaRef" class="w-full h-full"
				   autoplay :controls="false"
				   :src="mediaStore.sourceUrl">
			</video>
			<div v-if="!mediaStore.sourceUrl"
				 class="absolute top-0 left-0 border border-black
				 	w-full h-full flex justify-center items-center
				 ">
				💾
			</div>
		</div>
		<MediaControls :state="mediaState"
					   class="justify-center">
			<ToolsBar :media="mediaRef" />
			<button type="button" class="btn" id="drop-file"
					@click.stop.prevent="fileInput?.click()"
					@drop.prevent="fileDrop" @dragover="fileDrag"
					name="[Load]">💾</button>
		</MediaControls>
		<div class="flex gap-x-0.5 items-center justify-center">

			<SliceScrubBar v-if="IsSliceEdit(editMode.curEdit)"
						   class="flex items-center grow rounded-md w-4/6 max-w-4/6"
						   :edit="editMode.curEdit"
						   :media="mediaRef!" />
			<ScrubBar v-else-if="mediaRef"
					  class="flex items-center grow  max-w-4/6 w-4/6 rounded-md"
					  :media="mediaRef" />

		</div>
		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFilePicked">
	</div>
</template>