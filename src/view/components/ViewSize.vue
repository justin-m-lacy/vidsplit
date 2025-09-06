<script setup lang="ts">
import { Timeline } from '@/view/composables/timeline';

const props = defineProps<{
	timeline: Timeline
}>();

</script>
<template>
	<Transition
				enter-from-class="opacity-0"
				enter-active-class="opacity-100"
				enter-to-class="opacity-100"
				leave-from-class="opacity-100"
				leave-active-class="opacity-0"
				leave-to-class="opacity-0">
		<div v-if="timeline.zooming"
			 class="transition-opacity duration-200">{{
				Math.floor(100 * (1 / props.timeline.viewScale.value))
			}}%</div>
	</Transition>
</template>