import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

type Options = {

	slice?: {
		/**
		 * use frame perfect slicing.
		 */
		framePerfect?: boolean
	}

}

export const useOptions = defineStore('options', () => {


	const opts = useLocalStorage<Options>('options', {

		slice: {
			framePerfect: false
		}

	});

	return opts;


});