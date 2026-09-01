<script setup lang="ts">
import { TMediaEdit } from '@/model/edit';
import { useAppState } from '@/store/app-state';
import { useEditTool } from '@/store/edit-tool';
import { useMediaStore } from '@/store/media-store';
import { useOptions } from '@/store/options-store.js';
import { TEditTask, useTaskStore } from '@/store/task-store';
import { IsCutEdit } from '@/tools/cut.js';
import { IsSliceEdit } from '@/tools/slice';
import { IsSplitEdit } from '@/tools/split';
import { useMediaState } from '@/view/composables/media-state';
import CutTools from '@/view/tools/CutTools.vue';
import EncodeTools from '@/view/tools/EncodeTools.vue';
import SplitTools from '@/view/tools/SplitTools.vue';
import { Upload, X } from 'lucide-vue-next';
import MediaControls from '../components/MediaControls.vue';
import ToolsBar from '../components/ToolsBar.vue';
import SliceTools from '../tools/SliceTools.vue';

const videoElm = shallowRef<HTMLVideoElement>();

const mediaStore = useMediaStore();

const tasks = useTaskStore();

const appState = useAppState();

const curTask = shallowRef<TEditTask | null>(null);

const fileInput = shallowRef<HTMLInputElement>();

const opts = useOptions();

const tools = useEditTool();

const media = useMediaState(videoElm);

const taskBusy = computed(() => (curTask.value?.state == 'active' || curTask.value?.state == 'pending'));

onMounted(() => {
	if (!tools.tool) {
		tools.setSliceMode(media);
	}
})

function applyEdit(edit: TMediaEdit) {

	if (appState.hasFFMpeg) {
		curTask.value = tasks.add(edit.id, edit.apply());
	}

}

async function loadFile(files: FileList) {
	try {

		const file = files.item(0)!;
		media.file = file;

		mediaStore.setSource(file);
		tools.curEdit?.reset?.();

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

	<div class="flex flex-col shrink grow justify-stretch items-stretch gap-y-2">

		<div class="flex max-h-9/12 grow justify-center gap-x-2">

			<ToolsBar :media="media" class="ml-3 justify-end"
					  @settings="appState.showSettings = true" />

			<div class="relative flex justify-center items-center min-h-1/2 mx-0.5 p-0
		rounded-xs transition-colors overflow-clip"
				 :class="media.ready ? 'bg-slate-950' : 'border bg-blue-50 hover:bg-blue-100'"
				 @drop.prevent="fileDrop"
				 @dragover="fileDrag" @click="clickVideo">
				<video ref="videoElm" class="max-w-full max-h-full h-auto aspect-auto"
					   autoplay :controls="false"
					   :src="mediaStore.sourceUrl">
				</video>
				<Upload v-if="!mediaStore.sourceUrl"
						class="absolute translate-x-1/4 pointer-events-none" />
			</div>
		</div>

		<MediaControls :state="media"
					   class="flex w-full mx-4">

			<button type="button" class="icon-btn" id="drop-file"
					title="Load Media"
					@click.stop.prevent="fileInput?.click()"
					@drop.prevent="fileDrop" @dragover="fileDrag"
					name="[Load]">
				<Upload />
			</button>
		</MediaControls>

		<div v-if="curTask" class="flex justify-center items-center 
			w-full gap-x-1 h-3">
			<span class="text-sm font-bold">{{ curTask.total > 0 ?
				Math.round(100 * curTask.current / curTask.total) : 0 }}%</span>
			<div class="relative h-2 w-1/4 bg-slate-400 rounded-sm overflow-clip">
				<div class="absolute left-0 h-full bg-green-600 border-r-2 transition-[width] border-green-800/60"
					 :style="{
						width: curTask.state == 'complete' ? '100%' :
							(curTask.total > 0 ? `${(100 * curTask.current / curTask.total)}%` : 0)
					}">
				</div>
			</div>
			<button type="button" @click="curTask = null" class="h-10">
				<X class="rounded-full border border-red-600 h-1/3 w-auto bg-red-600" />
			</button>
		</div>

		<SliceTools v-if="IsSliceEdit(tools.curEdit)"
					@apply="applyEdit($event)"
					class="my-1"
					:hasFFMpeg="appState.hasFFMpeg"
					:edit="tools.curEdit"
					:media="media"
					:busy="taskBusy" />
		<CutTools v-else-if="IsCutEdit(tools.curEdit)"
				  @apply="applyEdit($event)"
				  class="my-1"
				  :hasFFMpeg="appState.hasFFMpeg"
				  :edit="tools.curEdit"
				  :media="media"
				  :busy="taskBusy" />
		<SplitTools v-else-if="IsSplitEdit(tools.curEdit)"
					@apply="applyEdit($event)"
					class="my-1"
					:edit="tools.curEdit"
					:hasFFMpeg="appState.hasFFMpeg"
					:media="media"
					:busy="taskBusy" />
		<EncodeTools v-else-if="videoElm"
					 class="my-1"
					 @apply="applyEdit($event)"
					 :busy="taskBusy"
					 :codecs="opts.codecs"
					 :media="media" />

		<input ref="fileInput" type="file" accept="video/*"
			   class="hidden" @change="onFilePicked">
	</div>
</template>