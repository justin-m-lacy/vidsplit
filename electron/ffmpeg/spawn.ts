import { spawn } from 'child_process';
import { ffmpegPath } from './install';

/**
 * @param args - arguments to pass to ffmpeg.
 * @param progress 
 * @param timeTotal - total clip length in seconds.
 * necessary because ffmpeg doesn't give total length information in updates.
 * @returns 
 */
export function spawnFFMpeg(args: string[],
	progress?: (cur: number, tot: number) => void, timeTotal: number = 0) {

	// find progress information in ffmpeg update.
	const progRE = /out_time_us=(\d+)/;

	return new Promise<void>((res, rej) => {

		const child = spawn(ffmpegPath ?? 'ffmpeg', args,
			{ windowsVerbatimArguments: true });

		if (progress) {

			// microseconds per second
			const US_PER_SEC = 1000000;
			// convert to microseconds
			timeTotal *= US_PER_SEC;

			child.stdout.on('data', (data: Buffer) => {
				//type is object.
				const prog = data.toString('utf-8').match(progRE);
				if (prog) {
					const cur = Number.parseInt(prog[1]);
					if (!Number.isNaN(cur)) {
						progress(cur, timeTotal);
					}
				}

			})
		}

		child.stderr.on('err', (err) => {
			console.error(err);
			rej(err);
		})
		child.addListener('exit', (code) => {
			if (code) rej(code);
			else res();
		});

	});

}

/**
Sample FFMpeg update.
bitrate=3456.9kbits/s
total_size=922570
out_time_us=2135000
out_time_ms=2135000
out_time=00:00:02.135000
dup_frames=0
drop_frames=0
speed= 673x
progress=end
 */