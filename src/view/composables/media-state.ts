import { minmax } from "@/util/view";
import { useEventListener } from "@vueuse/core";
import type { WatchSource } from "vue";

export type MediaState = ReturnType<typeof useMediaState>;

/**
 * Reactive media states.
 * @param mediaElm 
 * @returns 
 */
export function useMediaState(mediaElm: WatchSource<HTMLMediaElement | undefined>) {

	/// path to file being viewed.
	const file = shallowRef<File>();

	const volume = shallowRef<number>(1);

	const time = shallowRef<number>(0);
	const playing = shallowRef<boolean>(false);
	const paused = shallowRef<boolean>(false);
	const mediaRef = shallowRef<HTMLMediaElement | undefined>(undefined);
	const muted = shallowRef<boolean>(false);

	const duration = shallowRef<number>(0);

	const loop = shallowRef<boolean>(false);

	/**
	 * range of media to actually play.
	 */
	const playRange = shallowReactive({
		from: 0,
		to: 0
	})


	/**
	 * prevent bug where time flips back after a single-frame change.
	 * @param media 
	 * @param t 
	 */
	const forceTime = (t: number) => {

		if (mediaRef.value) {
			time.value = t;
			mediaRef.value.currentTime = t;
		}
		nextTick(() => {
			if (mediaRef.value && !Number.isNaN(t)) {
				time.value = t;
				mediaRef.value.currentTime = t;
			}
		})
	}

	watch(mediaElm, (media) => {

		mediaRef.value = media;
		if (media) {

			media.volume = volume.value;
			media.loop = loop.value;
			duration.value = Number.isNaN(media.duration) ? media.duration : 0;

		} else {
			duration.value = 0;
		}

	}, {
		immediate: true
	});

	useEventListener(mediaElm, 'durationchange', function (this: HTMLMediaElement) {
		if (!Number.isNaN(this.duration)) {
			duration.value = this.duration;
			if (playRange.to == 0) playRange.to = this.duration;
		}
	});
	useEventListener(mediaElm, 'loadedmetadata', function (this: HTMLMediaElement) {
		if (!Number.isNaN(this.duration)) {
			duration.value = this.duration;
			playRange.to = this.duration;
		}
	});

	useEventListener(mediaElm, 'timeupdate', function (this: HTMLMediaElement) {

		if (!playing.value) {
			time.value = this.currentTime;
		} else if (this.currentTime < playRange.from) {
			time.value = this.currentTime = playRange.from;
		} else if (this.currentTime >= playRange.to) {

			if (loop.value) {
				time.value = this.currentTime = playRange.from;
			} else {
				this.pause();
				time.value = this.currentTime = playRange.to;
			}

		} else {
			time.value = this.currentTime;
		}

	});

	useEventListener(mediaElm, ['playing', 'pause'], function (this: HTMLMediaElement) {

		paused.value = this.paused;

		if (!this.paused && !this.ended && this.readyState > 1) {

			playing.value = true;
			if (this.currentTime >= (playRange.to - 0.01)) {
				forceTime(playRange.from);
			}

		} else {
			playing.value = false
		}

	});

	return {

		playRange,

		/**
		 * True if media can be played.
		 */
		get ready() {
			const m = mediaRef.value;
			return m != null && duration.value > 0 && m.readyState > 0;
		},
		get fromPct() { return playRange.from / duration.value; },
		set fromPct(v: number) {

			if (Number.isNaN(duration.value)) return;
			playRange.from = minmax(v * duration.value, 0, playRange.to);
			if (time.value < playRange.from) {
				forceTime(playRange.from);
			}
		},

		get toPct() { return playRange.to / duration.value; },
		set toPct(v: number) {
			if (Number.isNaN(duration.value)) return;

			v = minmax(v, 0, 1);
			playRange.to = Math.max(v * duration.value, playRange.from);

			if (time.value > playRange.to) {
				if (loop.value) {
					time.value = playRange.from;
				} else {
					time.value = playRange.to;
					mediaRef.value?.pause();
				}
			}

		},

		get to() { return playRange.to },
		set to(v) { playRange.to = v },

		get from() { return playRange.from },
		set from(v) { playRange.from = v },

		get duration() { return duration.value },

		/**
		 * File media was loaded from. Used to apply video effects on original file.
		 */
		get file() { return file.value },
		set file(v: File | undefined) { file.value = v; },

		get loop() { return loop.value },
		set loop(v) {
			if (mediaRef.value) {
				mediaRef.value.loop = v;
			}
			loop.value = v;
		},

		get media() { return toValue<HTMLMediaElement | undefined>(mediaElm); },
		get muted() { return muted.value },
		set muted(v: boolean) {
			if (mediaRef.value) {
				mediaRef.value.muted = v;
			}
			muted.value = v;
		},

		get src() { return mediaRef.value?.src },

		get hasMedia() { return mediaRef.value != null },

		/**
		 * current play time.
		 */
		get time() { return time.value },
		set time(v: number) { forceTime(v) },

		get playing() { return playing.value },
		set playing(v: boolean) {
			v ? mediaRef.value?.play() : mediaRef.value?.pause();
		},
		get paused() { return paused.value },
		set paused(v: boolean) {
			v ? mediaRef.value?.pause() : mediaRef.value?.play();
		},
		play() { mediaRef.value?.play() },

		pause() { mediaRef.value?.pause() },
		stop() {
			if (mediaRef.value) {
				mediaRef.value.pause();
				mediaRef.value.currentTime = 0;
			}
		},
		get volume() { return volume.value },
		set volume(v: number) {
			if (mediaRef.value) {
				mediaRef.value.volume = v;
			}
			volume.value = v
		},
	}

}