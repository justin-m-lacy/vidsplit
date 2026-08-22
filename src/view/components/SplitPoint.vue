<script setup lang="ts">
defineProps<{ color?: string }>();
</script>
<template>
	<div class="absolute top-1/2 -translate-y-1/2">
		<div class="absolute top-0 w-3 h-2 -translate-x-1/2 -translate-y-full"
			 :class="color ?? 'bg-slate-950'"
			 :style="{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }">
			&nbsp;
		</div>
		<div class="w-[1px] left-0 -translate-x-1/2 h-full bg-slate-950/90 shadow-sm m-0 p-0'">
		</div>
		<div class="absolute bottom-0 w-3 h-2  -translate-x-1/2 translate-y-full"
			 :class="color ?? 'bg-slate-950'"
			 :style="{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }">
			&nbsp;
		</div>
	</div>
</template>