import { exec } from 'child_process';
import { promisify } from 'util';


export function testFFMpegInstall() {
	return new Promise<void>((res, rej) => {
		exec('ffmpeg -version', (error, stdout, stderr) => {
			if (error) {
				rej(`FFMpeg not available: ${error.message}`);
			}
			if (stderr) {
				console.error(`Error: ${stderr}`);
				rej(`FFMpeg error: ${stderr}`);
			}
			res();
		});
	});
}

export async function installFFmpeg() {

	try {

		let installer = await findInstaller();
		if (!installer) {
			await installPackage('@ffmpeg-installer/ffmpeg');
			// try again.
			installer = await findInstaller();
			if (!installer) {
				throw new Error(`Failed to find installer.`);
			}
		}


	} catch (err) {
		console.error('Error:', err.stderr || err.message);
	}

}

/**
 * Test if ffmpeg installer is available.
 */
async function findInstaller() {

	try {
		return await import('@ffmpeg-installer/ffmpeg');
	} catch (err) {
		return undefined;
	}

}

async function installPackage(packageName) {

	try {
		console.log(`Installing ${packageName}...`);
		const { stderr } = await promisify(exec)(`npm install ${packageName}`);

		// Log output (stdout for success, stderr for warnings)  
		if (stderr) console.warn('Warnings:', stderr);

		console.log(`${packageName} installed successfully!`);
	} catch (error) {
		console.error(`Failed to install ${packageName}:`, error.message);
		process.exit(1); // Exit with error code  
	}

}