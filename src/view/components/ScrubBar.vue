<script setup lang="ts">
import { useScrubBar } from '@/view/composables/scrub-bar';
import Scrub from '../components/Scrub.vue';

const props = defineProps<{
	media: HTMLMediaElement | undefined
}>();

const scrubRef = shallowRef<HTMLElement>();
const barRef = shallowRef<HTMLElement>();
const { percent } = useScrubBar(() => props.media, scrubRef, barRef);

</script>
<template>
	<div ref="barRef" id="scrubBar" class="w-full min-h-2 p-0 relative bg-green-500">

		<Scrub ref="scrubRef" class="absolute h-4 min-h-4 bg-slate-500 rounded-xs"
			   :style="{ left: `${percent}%` }" />

	</div>
</template>