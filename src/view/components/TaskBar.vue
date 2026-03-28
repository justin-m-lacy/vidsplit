<script setup lang="ts">
import { TEditTask } from '../../store/task-store';
defineProps<{
	task: TEditTask
}>();
</script>

<template>
	<div class="relative flex bg-gray-900">
		<div class="absolute bg-green-700 h-full left-0"
			 :style="{ width: `min( ${(100 * task.current / task.total)}%, 100%)` }"></div>
	</div>
</template>