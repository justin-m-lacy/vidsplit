<script setup lang="ts">
import { useSlider } from '@/view/composables/use-slider';


const volume = defineModel<number>({ default: 1, required: true });
const barElm = shallowRef<HTMLElement>();
const thumbElm = shallowRef<HTMLElement>();

useSlider(thumbElm, barElm, volume);

</script>
<template>
	<div ref="barElm" class="relative h-[5px] bg-gray-600 select-none">

		<div ref="thumbElm" class="absolute h-[14px] w-[6px]
			border border-gray-800 bg-gray-400 -top-1/2"
			 :style="{ left: `${100 * volume}%` }">&nbsp;</div>
	</div>
</template>