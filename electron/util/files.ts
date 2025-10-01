import { spawn } from 'child_process';
export const quoteStr = (s: string) => { return `"${s}"` }

export function waitExec(cmd: string, args: string[],
	progress?: (cur: number, tot: number) => void) {

	return new Promise<void>((res, rej) => {

		const child = spawn(cmd, args, { windowsVerbatimArguments: true });

		let lastProg: any = null;
		child.stdout.on('data', (data) => {
			//type is object.
			lastProg = data;
			progress?.(10, 100);

		})
		child.stderr.on('error', (err) => {
			console.error(err);
			rej(err);
		})
		child.addListener('exit', (code) => {
			if (lastProg) {
				console.dir(lastProg);
			}
			if (code) rej(code);
			else res();
		});

	});

}