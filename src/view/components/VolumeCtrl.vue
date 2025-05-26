<script setup lang="ts">
import { useSlider } from '@/view/composables/use-slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-vue-next';

const volume = defineModel<number>({ default: 1, required: true });
const muted = defineModel<boolean>('muted', { default: false, required: false },);
const barElm = shallowRef<HTMLElement>();
const thumbElm = shallowRef<HTMLElement>();

const showBar = shallowRef<boolean>(false);
useSlider(thumbElm, barElm, volume, true);

function onClick() {
	muted.value = !muted.value;
	console.log(`after mute: ${muted.value}`);
}

</script>
<template>
	<div class="flex flex-col items-center relative p-1"
		 @mouseover="showBar = true" @mouseleave="showBar = false">


		<Transition mode="in-out" @click="onClick">
			<VolumeX class="absolute -top-full" v-if="muted" />
			<Volume2 class="absolute -top-full" v-else-if="volume > 0.5" />
			<Volume1 class="absolute -top-full" v-else-if="volume > 0" />
			<Volume class="absolute -top-full" v-else />
		</Transition>


		<Transition mode="in-out"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0">
			<div v-if="showBar" ref="barElm" class="absolute -top-25 h-24 min-h-24
				duration-500 transition-opacity flex items-center justify-center
			 	 w-[5px] bg-gray-600 select-none
			">

				<div ref="thumbElm" class="absolute w-[14px] h-[6px]
				translate-y-1/2
			border border-gray-800 bg-gray-400"
					 :style="{ bottom: `${100 * (volume)}%` }">&nbsp;</div>

			</div>
		</Transition>



	</div>
</template>