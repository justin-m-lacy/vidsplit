import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

type Options = {

	video?: {

		// ffmpeg -c:v option
		codec?: 'libx264' | 'libx265' | 'libvpx-vp9' | 'libsvtav1' | 'default',

	},
	slice?: {
		/**
		 * use frame perfect slicing.
		 */
		framePerfect?: boolean
	}

}

export const useOptions = defineStore('options', () => {

	const codecs = ['default', 'libx264', 'libx265', 'libvpx-vp9', 'libsvtav1',];

	const store = useLocalStorage<Options>('options', {

		video: {
			codec: undefined,

		},
		slice: {
			framePerfect: false
		},


	});

	return {
		codecs,
		store
	};


});