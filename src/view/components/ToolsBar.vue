<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useSnapshot } from '@/store/snapshot';
import { IsCutEdit } from '@/tools/cut';
import { IsSliceEdit } from '@/tools/slice';
import { IsSplitEdit } from '@/tools/split';
import { MediaState } from '@/view/composables/media-state';
import { Camera, Film, SquareSplitHorizontal } from 'lucide-vue-next';

const props = defineProps<{
	media?: MediaState
}>();

const emits = defineEmits<{
	(e: 'settings'): void
}>();

const tools = useEditTool();

async function doSnapshot() {

	const media = props.media?.media as HTMLVideoElement | undefined;
	if (!media || props.media?.ready) return;

	await useSnapshot().saveSnap(media, media.currentTime);

}

function setCutMode() {
	if (!props.media) return;
	tools.setCutMode(props.media);
}

function setSliceMode() {

	if (!props.media) return;
	tools.setSliceMode(props.media);
}

function setSplitMode() {

	if (!props.media) return;
	tools.setSplitMode(props.media);
}

</script>
<template>
	<div class="flex flex-col gap-y-2 select-none">
		<button type="button" title="Open Settings"
				class="icon-btn text-lg p-0 text-gray-800"
				@click="emits('settings')">⚙️
		</button>
		<button type="button" title="Screenshot"
				class="icon-btn disabled:opacity-50 text-sm"
				:disabled="!media?.ready"
				@click="doSnapshot">
			<Camera />
		</button>
		<button type="button" title="Join Slices"
				class="icon-btn flex justify-center disabled:opacity-50 p-0.5 text-sm
				transition-colors"
				:class="IsSliceEdit(tools.curEdit) ?
					'bg-amber-500/40 rounded-md border border-amber-700' :
					''"
				:disabled="!media?.media"
				@click="setSliceMode">
			<Film />
		</button>
		<button type="button" title="Cut/Remove Slices"
				class="icon-btn flex justify-center disabled:opacity-50 p-0.5 text-sm
				transition-colors"
				:class="IsCutEdit(tools.curEdit) ?
					'bg-amber-500/40 rounded-md border border-amber-700' :
					''"
				:disabled="!media?.media"
				@click="setCutMode">✂</button>
		<button type="button" title="Split Media"
				class="icon-btn flex justify-center transition-colors items-center disabled:opacity-50 p-0.5 text-sm max-h-7"
				:class="IsSplitEdit(tools.curEdit) ?
					'bg-amber-500/40 rounded-md border border-amber-700' : ''"
				:disabled="!media?.media"
				@click="setSplitMode">
			<SquareSplitHorizontal />
		</button>
	</div>
</template>