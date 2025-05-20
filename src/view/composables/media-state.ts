import { useEventListener } from "@vueuse/core";
import type { WatchSource } from "vue";

export type MediaState = ReturnType<typeof useMediaState>;

/**
 * Reactive media states.
 * @param mediaRef 
 * @returns 
 */
export function useMediaState(mediaRef: WatchSource<HTMLMediaElement | undefined>) {

	const time = shallowRef<number>(0);
	const playing = shallowRef<boolean>(false);
	const paused = shallowRef<boolean>(false);
	const hasMedia = shallowRef<boolean>(false);

	const loop = shallowRef<boolean>(false);

	watch(mediaRef, (val) => {

		if (!val || Number.isNaN(val.duration)) {
			hasMedia.value = false;
		} else {
			hasMedia.value = true;
			loop.value = val.loop;
		}

	}, {
		immediate: true
	});

	useEventListener(mediaRef, 'loadedmetadata', function (this: HTMLMediaElement) {

		hasMedia.value = !Number.isNaN(this.duration);

	});

	useEventListener(mediaRef, 'timeupdate', function (this: HTMLMediaElement) {

		time.value = this.currentTime;

	});

	useEventListener(mediaRef, ['playing', 'pause'], function (this: HTMLMediaElement) {

		paused.value = this.paused;

		if (!this.paused && !this.ended && this.readyState > 1) {
			playing.value = true;
		} else {
			playing.value = false
		}

	});

	return {
		get loop() { return loop.value },
		set loop(v) {
			const media = toValue(mediaRef);
			if (media) {
				media.loop = v;
			}
			loop.value = v;
		},
		get hasMedia() { return hasMedia.value },
		get time() { return time.value },
		set time(v: number) {
			const media = toValue(mediaRef);
			if (media) {
				media.currentTime = v;
			}
		},
		get playing() { return playing.value },
		set playing(v: boolean) {
			const media = toValue(mediaRef);
			if (media) {
				if (v) {
					media.play();
				} else {
					media.pause();
				}
			}
		},
		get paused() { return paused.value },
		set paused(v: boolean) {
			const media = toValue(mediaRef);
			if (media) {
				if (v) {
					media.pause();
				} else {
					media.play();
				}
			}
		},
	}

}