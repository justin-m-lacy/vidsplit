<script setup lang="ts">
import { SplitEdit } from '@/tools/split';
import SplitBar from '@/view/tools/SplitBar.vue';
import { Download } from 'lucide-vue-next';
import Timestamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';

const props = defineProps<{
	edit: SplitEdit,
	media: MediaState
}>();

/**
 * Add cutting point at current play position.
 */
function addCut() {
	const pct = props.media.time / props.media.duration
	props.edit.addCut(pct);

}

async function saveSplits() {
	try {
		await props.edit.apply();
	} catch (err) {
		console.warn(err);
	}
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-3">
		<div class="flex justify-center gap-x-2">
			<button type="button"
					class="disabled:opacity-50 p-[1px] text-sm
					border border-green-800/40 rounded-sm bg-green-700/30"
					title="Add Split Point"
					@click="addCut">+✂</button>
			<span class="flex items-center text-[0.7rem]">
				<Timestamp :time="media.from" />&nbsp;to&nbsp;
				<Timestamp :time="media.to" />
			</span>

			<button type="button"
					class="disabled:opacity-50"
					:disabled="edit.cuts.length == 0"
					title="Split video"
					@click="saveSplits">
				<Download />
			</button>
		</div>
		<SplitBar :edit="edit" :media="media" />

	</div>
</template>