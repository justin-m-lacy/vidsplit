<script setup lang="ts">
import { useAppState } from '@/store/app-state';
import FFMpegState from '@/view/components/FFMpegState.vue';
import Media from './panes/Media.vue';
</script>

<template>

  <div class="flex flex-col justify-center items-center h-screen max-h-screen w-full
  cursor-auto select-none duration-200 bg-light-50 mb-1 p-0">
    <div v-if="!useAppState().electron"
         class="flex justify-center font-bold text-sm mt-2">
      Can't connect to main process.</div>
    <FFMpegState class="min-h-fit mb-2" />
    <Media class="shrink grow max-h-10/12 h-10/12 min-w-1/2 mb-2" />
  </div>
</template>