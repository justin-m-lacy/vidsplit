<script setup lang="ts">
import { useAppState } from '@/store/app-state';
import FFMpegState from '@/view/components/FFMpegState.vue';
import Media from './panes/Media.vue';
</script>

<template>

  <div class="flex flex-col justify-center items-center w-full
  cursor-auto select-none duration-200 bg-light-50">
    <div v-if="!useAppState().electron"
         class="flex w-full justify-center font-bold text-sm mt-2">
      Can't connect to main process.</div>
    <FFMpegState />
    <Media />
  </div>
</template>