<script setup lang="ts">
defineProps<{ selected: boolean }>();
</script>
<template>
	<div class="flex flex-col justify-stretch items-center -translate-x-1/2">
		<div class="w-3 h-2"
			 :class="selected ? 'bg-green-600' : 'bg-orange-400'"
			 :style="{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }">
			&nbsp;
		</div>
		<div class="grow w-[1px] bg-slate-950/90 shadow-sm m-0 p-0'">
		</div>
		<div class="w-3 h-2"
			 :class="selected ? 'bg-green-600' : 'bg-orange-400'"
			 :style="{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }">
			&nbsp;
		</div>
	</div>
</template>