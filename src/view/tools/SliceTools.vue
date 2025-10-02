<script setup lang="ts">
import { useSnapshot } from '@/store/snapshot';
import { TEditTask } from '@/store/task-store';
import { MediaSlice, SliceEdit } from '@/tools/slice';
import { Download, X } from 'lucide-vue-next';
import Timestamp from '../components/Timestamp.vue';
import { MediaState } from '../composables/media-state';
import SliceBar from './SliceBar.vue';

const props = defineProps<{
	edit: SliceEdit,
	media: MediaState,
	task?: TEditTask | null
}>();

const emit = defineEmits<{
	(e: 'apply', edit: SliceEdit): void;
}>();

const snapshots = useSnapshot();

/**
 * Parent of screenshot slices.
 */
const snapsElm = shallowRef<HTMLElement>();

const onDragSnapshot = (e: DragEvent, slice: MediaSlice) => {
	e.dataTransfer!.setData('text/plain', slice.id);
	e.dataTransfer!.dropEffect = 'move';
}

const onDropScreen = (e: DragEvent) => {

	e.preventDefault();

	const sliceId = e.dataTransfer?.getData('text/plain');
	const children = snapsElm.value?.children;
	if (!sliceId || !children) return;

	const dropX = e.clientX;

	let inSlice: string | undefined;
	for (let i = children.length - 1; i >= 0; i--) {

		const elm = children.item(i) as HTMLElement;
		if (!elm) continue;
		const rect = elm.getBoundingClientRect();
		if (rect.x <= dropX && rect.right >= dropX) {
			// search has to be by group id since not all groups visible.
			inSlice = elm.dataset.slice;
			break;
		}

	}
	if (inSlice) {
		moveSlice(sliceId, inSlice);
	}

}

function moveSlice(sliceId: string, toSlice: string) {

	const slices = props.edit.slices;

	const indFrom = slices.findIndex(s => s.id == sliceId);
	const indTo = slices.findIndex(s => s.id == toSlice);

	if (indFrom < 0 || indTo < 0 || indFrom == indTo) return;

	// slice being moved.
	const slice = slices[indFrom];

	// change depends on direction of move.
	if (indTo < indFrom) {

		props.edit.slices = [...slices.slice(0, indTo),
			slice,
		...slices.slice(indTo, indFrom), ...slices.slice(indFrom + 1)];

	} else {
		props.edit.slices = [...slices.slice(0, indFrom), ...slices.slice(indFrom + 1, indTo + 1), slice, ...slices.slice(indTo + 1)];
	}

}

function setViewRange(from: number, to: number) {
	props.media.from = from;
	props.media.to = to;
}

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

function removeSlice(s: MediaSlice) {
	props.edit.removeSlice(s);
}

function addSlice() {

	if (props.media.media) {
		const ss = snapshots.thumbnail(props.media.media as HTMLVideoElement);
		props.edit.addSlice(props.media.from, props.media.to, ss);
	}
}

</script>
<template>
	<div class="flex flex-col w-full items-center gap-y-3">
		<div class="flex justify-center gap-x-2">
			<button type="button"
					class="disabled:opacity-50 px-1 max-h-6
					flex items-center justify-center text-sm
					border border-green-800/40 rounded-sm bg-green-700/25"
					title="Set slice Start to current time"
					@click="setStart">
				&nbsp;
				<div class="w-2 h-4 rounded-l-full rounded-r-none
			 	border bg-amber-400 shadow-sm" />
				&nbsp;
			</button>
			<button type="button"
					class="disabled:opacity-50 flex items-center justify-center px-1 text-sm max-h-6
					border border-green-800/40 rounded-sm bg-green-700/25"
					title="Set slice End to current time"
					@click="setEnd">&nbsp;
				<div class="w-2 h-4 rounded-r-full rounded-l-none
			 	border bg-amber-400 shadow-sm" />
				&nbsp;
			</button>
			<button type="button"
					class="disabled:opacity-50 p-[1px] text-sm
					border border-green-800/40 rounded-sm bg-green-700/25"
					title="Add Slice"
					@click="addSlice">+✂</button>
			<span class="flex items-center text-[0.7rem]">
				<Timestamp :time="media.from" />&nbsp;to&nbsp;
				<Timestamp :time="media.to" />
			</span>

			<button type="button" class="disabled:opacity-50"
					:disabled="edit.slices.length == 0
						|| (task?.state == 'active' || task?.state == 'inactive')"
					title="Save sliced clips"
					@click="emit('apply', edit)">
				<Download />
			</button>
		</div>
		<SliceBar :edit="edit" :media="media" />
		<div ref="snapsElm" class="flex items-center mt-1 gap-x-1"
			 @dragover.prevent @drop="onDropScreen">
			<div v-for="s in edit.slices" :key="s.id" :data-slice="s.id" draggable="true"
				 class="relative h-12 hover:h-24 w-auto transition-transform border border-black"
				 @dragstart="onDragSnapshot($event, s)"
				 @click="setViewRange(s.from, s.to)">

				<X class="absolute rounded-full -right-1 -top-0.5
					drop-shadow-2xl border border-red-700 bg-red-600 max-h-6 h-1/3 w-auto p-0.5"
				   @click="removeSlice(s)" stroke-width="2.5" />

				<img v-if="s.snapshot" :src="s.snapshot"
					 class="w-full h-full">
				<div v-else
					 class="bg-amber-600 w-full h-full">&nbsp;</div>

			</div>
		</div>
	</div>
</template>