import { useEventListener } from "@vueuse/core";
import type { WatchSource } from "vue";

export type MediaState = ReturnType<typeof useMediaState>;

/**
 * Reactive media states.
 * @param mediaElm 
 * @returns 
 */
export function useMediaState(mediaElm: WatchSource<HTMLMediaElement | undefined>) {

	const time = shallowRef<number>(0);
	const playing = shallowRef<boolean>(false);
	const paused = shallowRef<boolean>(false);
	const hasMedia = shallowRef<boolean>(false);

	const loop = shallowRef<boolean>(false);

	watch(mediaElm, (val) => {

		if (!val || Number.isNaN(val.duration)) {
			hasMedia.value = false;
		} else {
			hasMedia.value = true;
			loop.value = val.loop;
		}

	}, {
		immediate: true
	});

	useEventListener(mediaElm, 'loadedmetadata', function (this: HTMLMediaElement) {
		hasMedia.value = !Number.isNaN(this.duration);
	});

	useEventListener(mediaElm, 'timeupdate', function (this: HTMLMediaElement) {
		time.value = this.currentTime;
	});

	useEventListener(mediaElm, ['playing', 'pause'], function (this: HTMLMediaElement) {

		paused.value = this.paused;

		if (!this.paused && !this.ended && this.readyState > 1) {
			playing.value = true;
		} else {
			playing.value = false
		}

	});

	return {

		get media() { return toValue<HTMLMediaElement | undefined>(mediaElm); },

		get src() { return toValue<HTMLMediaElement | undefined>(mediaElm)?.src ?? undefined },
		get loop() { return loop.value },
		set loop(v) {
			const media = toValue<HTMLMediaElement | undefined>(mediaElm);
			if (media) {
				media.loop = v;
			}
			loop.value = v;
		},
		get hasMedia() { return hasMedia.value },
		get time() { return time.value },
		set time(v: number) {
			const media = toValue<HTMLMediaElement | undefined>(mediaElm);
			if (media) {
				time.value = v;
				media.currentTime = v;
			}
		},
		get playing() { return playing.value },
		set playing(v: boolean) {
			const media = toValue<HTMLMediaElement | undefined>(mediaElm);
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
			const media = toValue<HTMLMediaElement | undefined>(mediaElm);
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