<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useMediaStore } from '@/store/media-store';
import { IsSliceEdit } from '@/tools/slice';
import { IsSplitEdit } from '@/tools/split';
import { useMediaState } from '@/view/composables/media-state';
import SplitTools from '@/view/tools/SplitTools.vue';
import { Upload } from 'lucide-vue-next';
import MediaControls from '../components/MediaControls.vue';
import ScrubBar from '../components/ScrubBar.vue';
import ToolsBar from '../components/ToolsBar.vue';
import SliceTools from '../tools/SliceTools.vue';

const videoElm = shallowRef<HTMLVideoElement>();

const mediaStore = useMediaStore();

const fileInput = shallowRef<HTMLInputElement>();

const tools = useEditTool();

const media = useMediaState(videoElm);

onMounted(() => {
	if (tools.tool == null) {
		tools.setSliceMode(media);
	}
})

async function loadFile(files: FileList) {
	try {

		const file = files.item(0)!;
		media.file = file;

		mediaStore.setSource(file);

	} catch (err) {
		console.error(err);
	}
}

function clickVideo(e: MouseEvent) {

	if (media.hasSource) {
		if (media.playing) {
			media.pause();
		} else {
			media.play();
		}
	} else {
		e.preventDefault();
		fileInput.value?.click();
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
				   :src="mediaStore.sourceUrl"
				   @click="clickVideo">
			</video>
			<Upload v-if="!mediaStore.sourceUrl"
					class="absolute top-1/2 left-1/2 pointer-events-none select-none
				 	 flex justify-center items-center" />
		</div>
		<MediaControls :state="media"
					   class="flex items-center w-full mx-4">
			<ToolsBar :media="media" class="ml-3" />
			<button type="button" class="btn" id="drop-file"
					title="Load Media"
					@click.stop.prevent="fileInput?.click()"
					@drop.prevent="fileDrop" @dragover="fileDrag"
					name="[Load]">
				<Upload />
			</button>
		</MediaControls>
		<div class="flex gap-x-0.5 w-full items-center justify-center">

			<SliceTools v-if="IsSliceEdit(tools.curEdit)"
						@apply="tools.applyEdit($event)"
						class="flex items-center grow rounded-md max-w-5/6"
						:edit="tools.curEdit"
						:media="media" />
			<SplitTools v-else-if="IsSplitEdit(tools.curEdit)"
						@apply="tools.applyEdit($event)"
						class="flex items-center grow rounded-md max-w-5/6"
						:edit="tools.curEdit"
						:media="media" />

			<ScrubBar v-else-if="videoElm"
					  class="flex items-center grow max-w-5/6"
					  :media="media" />

		</div>
		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFilePicked">
	</div>
</template>