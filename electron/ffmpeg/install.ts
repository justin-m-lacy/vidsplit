import { exec } from 'child_process';
import { promisify } from 'util';

export type FFMpegModule = typeof import('@ffmpeg-installer/ffmpeg');

let ffmpegPath: string | undefined = undefined;
let ffmpegVers: string | undefined = undefined;

export { ffmpegPath, ffmpegVers };

/**
 * Tests for ffmpeg install and returns version information, if available.
 */
export function testFFMpegInstall() {
	return new Promise<string>((res, rej) => {
		exec('ffmpeg -version', (error, stdout, stderr) => {

			if (error || stderr) {
				rej(`${error?.message ?? stderr}`);
				return;
			}

			const versRegex = /version ((?:\d+\.?)+)/i;
			const vers = versRegex.exec(stdout);
			ffmpegVers = vers ? vers[1] : 'unknown';
			ffmpegPath = 'ffmpeg';

			res(ffmpegVers);

		});
	});
}

export async function installFFmpeg() {

	try {

		const pkg = '@ffmpeg-installer/ffmpeg';
		let installer: FFMpegModule | undefined = await findPackage(pkg);
		if (!installer) {
			installer = await installPackage(pkg);
			if (!installer) {
				throw new Error(`Failed to find installer.`);
			}
		}
		ffmpegPath = installer.path;
		ffmpegVers = installer.version;

		return {
			path: ffmpegPath,
			version: ffmpegVers
		}

	} catch (err) {
		console.error('Error:', err.stderr || err.message);
	}

}

/**
 * Test if ffmpeg installer is available.
 */
export async function findPackage<T extends string>(pkg: T) {
	try {
		return await import(pkg);
	} catch (err) {
		return undefined;
	}
}

export async function installPackage(pkg) {

	try {
		console.log(`Installing ${pkg}...`);
		const { stderr } = await promisify(exec)(`npm install ${pkg}`);

		// Log output (stdout for success, stderr for warnings)  
		if (stderr) console.warn('Warnings:', stderr);

		console.log(`${pkg} installed`);
		return findPackage(pkg);

	} catch (error) {
		console.error(`Failed to install ${pkg}:`, error.message);
		return undefined;
	}

}