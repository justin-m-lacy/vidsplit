<script setup lang="ts">
import { TMediaEdit } from '@/model/edit';
import { useEditTool } from '@/store/edit-tool';
import { useMediaStore } from '@/store/media-store';
import { TEditTask, useTaskStore } from '@/store/task-store';
import { IsSliceEdit } from '@/tools/slice';
import { IsSplitEdit } from '@/tools/split';
import { useMediaState } from '@/view/composables/media-state';
import SplitTools from '@/view/tools/SplitTools.vue';
import { Upload, X } from 'lucide-vue-next';
import MediaControls from '../components/MediaControls.vue';
import ScrubBar from '../components/ScrubBar.vue';
import ToolsBar from '../components/ToolsBar.vue';
import SliceTools from '../tools/SliceTools.vue';

const videoElm = shallowRef<HTMLVideoElement>();

const mediaStore = useMediaStore();

const tasks = useTaskStore();

const curTask = shallowRef<TEditTask | null>(null);

const fileInput = shallowRef<HTMLInputElement>();

const tools = useEditTool();

const media = useMediaState(videoElm);

onMounted(() => {
	if (tools.tool == null) {
		tools.setSliceMode(media);
	}
})

function applyEdit(edit: TMediaEdit) {

	curTask.value = tasks.add(edit.id, edit.apply());

}

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
	<div class="flex flex-col items-center m-1 gap-y-2 w-3/5">
		<div class="self-center relative m-1 border border-black w-full"
			 @drop.prevent="fileDrop" @dragover="fileDrag" @click="clickVideo">
			<video ref="videoElm" class="w-full h-full"
				   autoplay :controls="false"
				   :src="mediaStore.sourceUrl">
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

		<div v-if="curTask" class="flex items-center justify-center
			w-full gap-x-1 h-3">
			<div class="h-2 w-1/4 bg-slate-400 rounded-sm overflow-clip">
				<div class="h-full bg-green-600 border-r-2 border-green-800/60"
					 :style="{
						width: curTask.total > 0 ? `${(100 * curTask.current / curTask.total)}%` : 0
					}">
				</div>
			</div>
			<button type="button" @click="curTask = null" class="h-10">
				<X class="rounded-full border border-red-600 h-1/3 w-auto bg-red-600" />
			</button>
		</div>

		<SliceTools v-if="IsSliceEdit(tools.curEdit)"
					@apply="applyEdit($event)"
					class="flex justify-center items-center grow w-full max-w-11/12"
					:edit="tools.curEdit"
					:media="media"
					:task="curTask" />
		<SplitTools v-else-if="IsSplitEdit(tools.curEdit)"
					@apply="applyEdit($event)"
					class="flex justify-stretch items-center grow max-w-11/12"
					:edit="tools.curEdit"
					:media="media"
					:task="curTask" />

		<ScrubBar v-else-if="videoElm"
				  class="flex items-center justify-center grow max-w-11/12"
				  :media="media" />

		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFilePicked">
	</div>
</template>