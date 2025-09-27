import { spawn } from 'child_process';
export const quoteStr = (s: string) => { return `"${s}"` }

export function waitSpawn(cmd: string, args: string[]) {

	return new Promise<void>((res, rej) => {

		const child = spawn(cmd, args, { windowsVerbatimArguments: true });

		child.stdout.on('data', (data) => {
			//type is object.
		})
		child.stderr.on('error', (err) => {
			console.error(err);
			rej(err);
		})
		child.addListener('exit', (code) => {
			if (code) rej(code);
			else res();
		});

	});

}