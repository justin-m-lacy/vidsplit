<script setup lang="ts">
defineProps<{
	label?: string,
	codecs: string[]
}>();

const model = defineModel<string>('default');

const codec = computed({

	get() { return model.value ?? 'default' },
	set(v) { model.value = v; }

});

</script>
<template>
	<div class="flex h-6 gap-x-2 items-center text-sm">
		<label v-if="label" for="videoCodec" class="font-semibold">{{ label }}</label>
		<select id="videoCodec" v-model="codec"
				class="flex items-start justify-center h-8 py-0 p-1 pl-2">
			<option v-for="s in codecs" :label="s" :value="s">
				{{ s }}
			</option>
		</select>
	</div>
</template>