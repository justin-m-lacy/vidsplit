import { FFMpegModule, findPackage, installPackage, testFFMpegInstall } from "./electron/ffmpeg/install";


async function versionCheck() {

	try {

		const res = await testFFMpegInstall();
		console.log(`ffmpeg found: ${res}`);

	} catch (err) {
		console.log(`error: ${err}`);
	}
}

await versionCheck();

const pkg = '@ffmpeg-installer/ffmpeg';
let lib: FFMpegModule | undefined = await findPackage(pkg);

if (lib) {
	console.log(`ffmpeg-installer vers: ${lib.version}`)
	console.log(`installed path: ${lib.path}`)
} else {

	lib = await installPackage(pkg);
	if (lib) {
		console.log(`ffmpeg-installer vers: ${lib.version}`)
		console.log(`installed path: ${lib.path}`)
	} else {
		console.log(`failed to install installer.`);
	}

}

await versionCheck();