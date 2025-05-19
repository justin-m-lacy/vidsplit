import { useEventListener } from "@vueuse/core";

export function useScrubBar(mediaRef: MaybeRefOrGetter<HTMLMediaElement>,
	scrub: MaybeRefOrGetter<HTMLMediaElement>,
	bar: MaybeRefOrGetter<HTMLMediaElement>
) {

	const playTime = shallowRef<number>(0);

	useEventListener(mediaRef, 'timeupdate', function (this: HTMLMediaElement) {
		playTime.value = this.currentTime;
	});

	return {
		playTime
	}

}