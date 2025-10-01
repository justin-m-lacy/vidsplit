<script setup lang="ts">
import { TEditTask } from '../../store/task-store';
defineProps<{
	task: TEditTask
}>();
</script>

<template>
	<div class="flex items-center text-sm">
		{{ task.total > 0 ?
			Math.min(100 * task.current / task.total, 100).toFixed(1)
			: 0 }}%
	</div>
</template>