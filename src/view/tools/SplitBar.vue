<script setup lang="ts">
import { MediaCut, SplitEdit } from '@/tools/split';
import CutPoint from '@/view/components/CutPoint.vue';
import { useSplitDrags } from '@/view/composables/split-drag';
import { ComponentPublicInstance } from 'vue';
import ViewSize from '../components/ViewSize.vue';
import { MediaState } from '../composables/media-state';
import { useTimeline } from '../composables/timeline';

const props = defineProps<{
	edit: SplitEdit,
	media: MediaState
}>();

const emit = defineEmits<{
	(e: 'newCut', pct: number): void;
}>();

const barElm = shallowRef<HTMLElement>();
const scrubElm = shallowRef<HTMLElement>();
const cutElms = useTemplateRef<ComponentPublicInstance[] | null>('cutElms');

const curCut = defineModel<MediaCut | null>('curCut', { default: null });

const tl = useTimeline(props.media, scrubElm, barElm);
const { scrubPct, toBarPct } = tl;

// drag split positions.
useSplitDrags(tl, props.edit, cutElms, curCut)

function onDblClickBar(e: MouseEvent) {
	if (e.target !== barElm.value && e.target !== scrubElm.value) {
		return;
	}
	emit('newCut', tl.posToGlobalPct(e.clientX));
}

/**
 * Get style position for time.
 * @param t 
 */
function getPos(pct: number) {
	return { left: `${100 * pct}%` }
}
</script>
<template>

	<div class="flex justify-stretch w-full items-center select-none
	text-xxs gap-x-2 min-h-6">
		<div ref="barElm" class="relative flex items-center w-full grow min-h-2 border bg-sky-200 border-sky-700"
			 @dblclick="onDblClickBar($event)">

			<div class="absolute bg-green-500/75 h-full left-0
				pointer-events-none select-none"
				 :style="{
					width: `${100 * tl.scrubPct.value}%`
				}">&nbsp;</div>

			<CutPoint ref="cutElms" v-for="cut of edit.cuts"
					  :id="cut.id" :key="cut.id"
					  class="absolute z-10 h-7 min-h-4"
					  :selected="cut.id == curCut?.id"
					  :style="getPos(toBarPct(cut.pct))" />

			<div ref="scrubElm" class="absolute w-[1px] h-4 min-h-4 -translate-x-1/2
			border border-slate-800 bg-slate-400 rounded-xs shadow-sm"
				 :style="getPos(scrubPct)">&nbsp;</div>

			<div class="absolute w-full h-full pointer-events-none
			border-l border-r border-sky-800" :style="{
				backgroundImage: `repeating-linear-gradient( 90deg,
				#00000077,
				transparent 1px,
				transparent 15px )`
			}">
			</div>

		</div>
		<ViewSize :timeline="tl" />
	</div>

</template>