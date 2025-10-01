<script setup lang="ts">
import { TEditTask } from '@/store/task-store';
import { MediaCut, SplitEdit } from '@/tools/split';
import SplitBar from '@/view/tools/SplitBar.vue';
import { Download, SplitSquareHorizontal, Trash } from 'lucide-vue-next';
import { MediaState } from '../composables/media-state';

const props = defineProps<{
	edit: SplitEdit,
	media: MediaState,
	// running task.
	task?: TEditTask | null
}>();


const emit = defineEmits<{
	(e: 'apply', edit: SplitEdit): void;
}>();

/// selected cutting point.
const curCut = shallowRef<MediaCut | null>(null);

/**
 * Add cutting point at current play position.
 */
function addCut(pct?: number) {
	if (typeof pct !== 'number') pct = props.media.time / props.media.duration
	curCut.value = props.edit.addCut(pct);
}

function deleteCut() {

	const cut = curCut.value;
	if (!cut) return;

	props.edit.removeCut(cut);
	if (cut.id == curCut.value?.id) {
		curCut.value = null;
	}
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-3">
		<div class="flex justify-center gap-x-2">
			<button type="button"
					class="flex disabled:opacity-50 p-[1px] text-sm
					border border-green-800/40 rounded-sm bg-green-700/30"
					title="Add Split Point"
					@click="addCut()">
				+
				<SplitSquareHorizontal />
			</button>
			<button type="button"
					class="disabled:opacity-50 p-[1px] text-sm
					border border-red-800/40 rounded-sm bg-red-700/30"
					title="Remove Split Point"
					:disabled="!curCut"
					@click="deleteCut">
				<Trash />
			</button>
			<button type="button" class="disabled:opacity-50"
					:disabled="Object.keys(edit.cuts).length == 0 || (task?.state == 'active' || task?.state == 'inactive')"
					title="Split video"
					@click="emit('apply', edit)">
				<Download />
			</button>
		</div>
		<SplitBar :edit="edit" :media="media"
				  v-model:cur-cut="curCut"
				  @new-cut="addCut($event)" />

	</div>
</template>