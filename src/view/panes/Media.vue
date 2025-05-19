<script setup lang="ts">
import { createMediaInfo, TMediaInfo } from '@/model/media';
import { useEditTool } from '@/store/edit-tool';
import { IsSliceEdit } from '@/tools/slice';
import SliceScrubBar from '@/view/tools/SliceScrubBar.vue';
import MediaControls from '../components/MediaControls.vue';
import ScrubBar from '../components/ScrubBar.vue';
import ToolsBar from '../components/ToolsBar.vue';

const mediaRef = shallowRef<HTMLMediaElement>();
const mediaInfo = shallowRef<TMediaInfo>();

const sourceUrl = shallowRef<string>();

const fileInput = ref<HTMLInputElement>();

const editMode = useEditTool();

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
	<div class="flex flex-col items-stretch m-1">
		<video ref="mediaRef" class="self-center min-w-48 w-1/2 m-1"
			   autoplay controls="false"
			   :src="sourceUrl"
			   @loadedmetadata="onMetadata"
			   @drop.prevent="fileDrop" @dragover="fileDrag"></video>
		<MediaControls :media="mediaRef" class="justify-center">
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
			   class="hidden" @change="onFileSelected">
	</div>
</template>