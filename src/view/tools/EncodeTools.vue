<script setup lang="ts">
import { EncodeEdit, EncodeTool } from '@/tools/encode.js';
import CodecSelect from '@/view/components/CodecSelect.vue';
import ScrubBar from '@/view/tools/ScrubBar.vue';
import { Download } from 'lucide-vue-next';
import { MediaState } from '../composables/media-state.js';

const props = defineProps<{
	media: MediaState,
	hasFFMpeg?: boolean,
	codecs: string[],
	busy?: boolean
}>();

const edit = ref<EncodeEdit>(EncodeTool.newEdit(props.media));

watch(() => props.media, (media) => {
	edit.value.media = media;
});

const emit = defineEmits<{
	(e: 'apply', edit: EncodeEdit): void;
}>();


</script>
<template>
	<div class="flex flex-col items-center gap-y-3">

		<div class="flex justify-center gap-x-8">

			<CodecSelect :codecs="codecs" v-model="edit.codec" label="Codec" />

			<button type="button" class="disabled:opacity-50"
					:disabled="!hasFFMpeg || busy"
					title="Re-encode Media"
					@click="emit('apply', edit)">
				<Download />
			</button>
		</div>
		<ScrubBar :media="media" class="max-w-11/12" />

	</div>
</template>