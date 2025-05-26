<script setup lang="ts">
import { useSlider } from '@/view/composables/use-slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-vue-next';

const props = defineProps<{
	muted?: boolean
}>();

const volume = defineModel<number>({ default: 1, required: true });
const barElm = shallowRef<HTMLElement>();
const thumbElm = shallowRef<HTMLElement>();

const showBar = shallowRef<boolean>(false);
useSlider(thumbElm, barElm, volume, true);

</script>
<template>
	<div class="flex flex-col items-center relative"
		 @mouseover="showBar = true" @mouseout="showBar = false">

		<div class="absolute -top-25 h-24 min-h-24">
			<div ref="barElm"
				 class="absolute flex items-center justify-center h-full
			 	 w-[5px] bg-gray-600 select-none">

				<div ref="thumbElm" class="absolute w-[14px] h-[6px]
				translate-y-1/2
			border border-gray-800 bg-gray-400"
					 :style="{ bottom: `${100 * (volume)}%` }">&nbsp;</div>
			</div>
		</div>

		<VolumeX v-if="muted" />
		<Volume2 v-else-if="volume > 0.5" />
		<Volume1 v-else-if="volume > 0" />
		<Volume v-else />

	</div>
</template>