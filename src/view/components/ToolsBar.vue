<script setup lang="ts">
import { useEditTool } from '@/store/edit-tool';
import { useSnapshot } from '@/store/snapshot';
import { IsSliceEdit } from '@/tools/slice';
import { IsSplitEdit } from '@/tools/split';
import { MediaState } from '@/view/composables/media-state';
import { Camera, SquareSplitHorizontal } from 'lucide-vue-next';

const props = defineProps<{
	media?: MediaState
}>();

const tools = useEditTool();

async function doSnapshot() {

	const media = props.media?.media as HTMLVideoElement | undefined;
	if (!media || props.media?.ready) return;

	await useSnapshot().saveSnap(media, media.currentTime);

}

function setSliceMode() {

	if (!props.media?.hasSource) return;
	tools.setSliceMode(props.media);
}
function setSplitMode() {

	if (!props.media?.hasSource) return;
	tools.setSplitMode(props.media);
}

</script>
<template>
	<div class="flex justify-center items-center gap-x-2 select-none">
		<button type="button" title="Screenshot"
				class="disabled:opacity-50 text-sm"
				:disabled="!media?.ready"
				@click="doSnapshot">
			<Camera />
		</button>
		<button type="button" title="Create Slices"
				class="flex justify-center disabled:opacity-50 p-0.5 text-sm"
				:class="IsSliceEdit(tools.curEdit) ?
					'bg-amber-500/40 border border-amber-700' :
					''"
				:disabled="!media?.hasSource"
				@click="setSliceMode">✂</button>
		<button type="button" title="Split Media"
				class="flex justify-center disabled:opacity-50 p-0.5 text-sm"
				:class="IsSplitEdit(tools.curEdit) ?
					'bg-amber-500/40 border border-amber-700' : ''"
				:disabled="!media?.hasSource"
				@click="setSplitMode">
			<SquareSplitHorizontal />
		</button>
	</div>
</template>