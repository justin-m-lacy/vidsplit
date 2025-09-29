<script setup lang="ts">
import { SplitEdit } from '@/tools/split';
import CutPoint from '@/view/components/CutPoint';
import { useSplitDrags } from '@/view/composables/split-drag';
import ViewSize from '../components/ViewSize.vue';
import { MediaState } from '../composables/media-state';
import { useTimeline } from '../composables/timeline';

const props = defineProps<{
	edit: SplitEdit,
	media: MediaState
}>();

const barElm = shallowRef<HTMLElement>();
const scrubElm = shallowRef<HTMLElement>();
const cutElms = useTemplateRef<HTMLElement[] | null>('cutElms');

const tl = useTimeline(props.media, scrubElm, barElm);
const { scrubPct, toBarPct } = tl;

// drag split positions.
useSplitDrags(props.media, props.edit, cutElms, barElm)

function onDblClickBar(e: MouseEvent) {

	const pct = tl.posToGlobalPct(e.clientX);
	props.edit.addCut(pct);

}

function onClickBar(e: MouseEvent) {

}

watch(() => props.edit.cuts, (cuts) => {
	console.log(`cuts changed: ${cuts.length}`);
})

watch(cutElms, (elms) => {

	console.log(`elements changed: ${elms?.length}`);

});

onMounted(() => {

})

/**
 * Get style position for time.
 * @param t 
 */
function getPos(pct: number) {
	return {
		left: `${100 * pct}%`
	}
}
</script>
<template>

	<div class="flex justify-stretch w-full items-center select-none
	text-xxs gap-x-2 min-h-5">
		<div ref="barElm" class="relative flex items-center w-full grow min-h-1 border border-red-700 bg-red-500"
			 @click.self="onClickBar" @dblclick="onDblClickBar($event)">

			<CutPoint ref="cutElms" v-for="cut of edit.cuts"
					  :id="cut.id" :key="cut.id"
					  class="absolute z-10 w-1 h-5 min-h-4
					   bg-amber-500 shadow-sm"
					  :style="getPos(toBarPct(cut.pct))" />

			<div ref="scrubElm" class="absolute w-2 h-4 min-h-4 -translate-x-1/2
			border border-slate-800 bg-slate-400 rounded-xs shadow-sm"
				 :style="getPos(scrubPct)">&nbsp;</div>


		</div>
		<ViewSize :timeline="tl" />
	</div>

</template>