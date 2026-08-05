<script setup lang="ts">
import { TEditTask } from '@/store/task-store';
import { CutEdit } from '@/tools/cut.js';
import { MediaSlice } from '@/tools/slice';
import CutRange from '@/view/tools/CutRange.vue';
import SliceBar from '@/view/tools/SliceBar.vue';
import { Download } from 'lucide-vue-next';
import TimeStamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state.js';

const props = defineProps<{
	edit: CutEdit,
	media: MediaState,
	hasFFMpeg?: boolean,
	task?: TEditTask | null
}>();

const emit = defineEmits<{
	(e: 'apply', edit: CutEdit): void;
}>();
/**
 * set slice start to current play position.
 */
function setStart() {
	props.media.from = props.media.time;
}

/**
 * set slice start to current play position.
 */
function setEnd() {
	props.media.to = props.media.time;
}

function removeCut(s: MediaSlice) {
	props.edit.removeCut(s);
}
function addCut() {

	if (props.media.media) {
		props.edit.addCut(props.media.from, props.media.to);
	}
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-3">
		<div class="flex justify-center gap-x-2">
			<button type="button"
					class="disabled:opacity-50 px-1 max-h-6
					flex items-center justify-center text-sm
					border border-green-800/40 rounded-sm bg-green-700/25
					hover:bg-green-700/40 transition-colors"
					title="Set slice Start to current time"
					@click="setStart">
				&nbsp;
				<div class="w-2 h-4 rounded-l-full rounded-r-none
			 	border bg-amber-400 shadow-sm" />
				&nbsp;
			</button>
			<button type="button"
					class="disabled:opacity-50 flex items-center justify-center px-1 text-sm max-h-6
					border border-green-800/40 rounded-sm bg-green-700/25
					hover:bg-green-700/40 transition-colors"
					title="Set slice End to current time"
					@click="setEnd">&nbsp;
				<div class="w-2 h-4 rounded-r-full rounded-l-none
			 	border bg-amber-400 shadow-sm" />
				&nbsp;
			</button>
			<button type="button"
					class="disabled:opacity-50 p-[1px] text-sm
					border border-green-800/40 rounded-sm bg-green-700/25
					hover:bg-green-700/40 transition-colors"
					title="Cut"
					:disabled="!media.ready"
					@click="addCut">✂</button>
			<span class="flex items-center text-[0.7rem]">
				<TimeStamp :time="media.from" />&nbsp;to&nbsp;
				<TimeStamp :time="media.to" />
			</span>

			<button type="button" class="disabled:opacity-50"
					:disabled="!hasFFMpeg || (edit.cuts.length == 0)
						|| (task?.state == 'active' || task?.state == 'pending')"
					title="Save sliced clips"
					@click="emit('apply', edit)">
				<Download />
			</button>
		</div>
		<SliceBar :media="media">
			<template v-slot:bar="{ timeline }">
				<CutRange v-for="cut in edit.cuts" :id="cut.id"
						  :timeline="timeline"
						  :cut="cut"
						  class="absolute" />
			</template>
		</SliceBar>
	</div>
</template>