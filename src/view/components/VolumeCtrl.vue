<script setup lang="ts">
import { useSlider } from '@/view/composables/use-slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-vue-next';

const volume = defineModel<number>({ default: 1, required: true });
const muted = defineModel<boolean>('muted', { default: false, required: false },);
const barElm = shallowRef<HTMLElement>();
const thumbElm = shallowRef<HTMLElement>();

const showBar = shallowRef<boolean>(false);
const { dragging } = useSlider(thumbElm, barElm, volume, true);

</script>
<template>
	<div class="flex justify-center items-center relative p-1"
		 @mouseover="showBar = true" @mouseleave="showBar = false">


		<Transition mode="in-out" @click="muted = !muted">
			<VolumeX class="absolute -top-full" v-if="muted" />
			<Volume2 class="absolute -top-full" v-else-if="volume > 0.5" />
			<Volume1 class="absolute -top-full" v-else-if="volume > 0" />
			<Volume class="absolute -top-full" v-else />
		</Transition>

		<div class="absolute w-8 bg-transparent"
			 :class="showBar ? '-top-32 min-h-32 h-36' : 'h-8'">

		</div>


		<Transition mode="in-out"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0">
			<div v-if="dragging || showBar" ref="barElm" class="absolute -top-28 h-24 min-h-24
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