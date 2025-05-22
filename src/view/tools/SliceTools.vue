<script setup lang="ts">
import { useScreenshots } from '@/store/screenshot';
import { SliceEdit } from '@/tools/slice';
import { Download, X } from 'lucide-vue-next';
import { MediaSlice } from 'shared/edits';
import SliceScrubBar from './SliceBar.vue';

const props = defineProps<{
	edit: SliceEdit,
	media: HTMLVideoElement
}>();

const screenshots = useScreenshots();

function removeSlice(s: MediaSlice) {
	props.edit.removeSlice(s);
}

function addSlice() {

	const ss = screenshots.create(props.media);
	props.edit.addSlice(ss);
}

function saveSlice() {
	try {
		props.edit.apply();
	} catch (err) {
		console.warn(err);
	}
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-2">
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
		<div class="flex items-center mt-1 gap-x-1">
			<div v-for="s in edit.slices" :key="s.id"
				 class="relative h-12 hover:h-24 hover:w-auto transition-transform border border-black">

				<X class="absolute rounded-full -right-1 -top-0.5
					drop-shadow-2xl border border-red-700 bg-red-600 max-h-6 h-1/3 w-auto p-0.5"
				   @click="removeSlice(s)" stroke-width="2.5" />

				<img v-if="s.screenshot" :src="s.screenshot"
					 class="w-full h-full">
				<div v-else
					 class="bg-amber-600 w-full h-full">&nbsp;</div>

			</div>
		</div>
	</div>
</template>