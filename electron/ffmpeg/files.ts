import { spawn } from 'child_process';
export const quoteStr = (s: string) => { return `"${s}"` }

// find progress information in ffmpeg update.
const progRE = /out_time_us=(\d+)/;

const US_PER_SEC = 1000000;

/**
 * 
 * @param cmd 
 * @param args 
 * @param progress 
 * @param timeTotal - total clip length in seconds.
 * necessary because ffmpeg doesn't give total length information in updates.
 * @returns 
 */
export function spawnFFMpeg(cmd: string, args: string[],
	progress?: (cur: number, tot: number) => void, timeTotal: number = 0) {

	// convert to microseconds
	timeTotal *= US_PER_SEC;

	return new Promise<void>((res, rej) => {

		const child = spawn(cmd, args, { windowsVerbatimArguments: true });

		if (progress) {
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