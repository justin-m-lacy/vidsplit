<script setup lang="ts">
import { useScreenshots } from '@/store/screenshot';
import { SliceEdit } from '@/tools/slice';
import { Download } from 'lucide-vue-next';
import SliceScrubBar from './SliceBar.vue';

const props = defineProps<{
	edit: SliceEdit,
	media: HTMLVideoElement
}>();

const screenshots = useScreenshots();

function addSlice() {

	const ss = screenshots.create(props.media);
	props.edit.addSlice(ss);
}

function saveSlice() {
	props.edit.apply();
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-1">
		<div class="flex justify-center gap-x-2">
			<button type="button"
					class="disabled:opacity-50 border border-slate-800 rounded-xs"
					@click="addSlice">+✂</button>
			<button type="button"
					class="disabled:opacity-50"
					:disabled="edit.slices.length == 0"
					@click="saveSlice">
				<Download />
			</button>
		</div>
		<SliceScrubBar :edit="edit" :media="media" />
		<div class="flex">
			<div v-for="s in edit.slices" :key="s.id"
				 class="relative w-12 h-12 border border-black">

				<img v-if="s.screenshot" :src="s.screenshot"
					 class="w-full h-full">
				<div v-else
					 class="bg-amber-600 w-full h-full">&nbsp;</div>

			</div>
		</div>
	</div>
</template>