import { FFMpegModule, findPackage, getFFMpegVers, installPackage } from "./electron/ffmpeg/install";


async function versionCheck() {

	try {
		const res = await getFFMpegVers();
	} catch (err) {
		console.log(`error: ${err}`);
	}
}

await versionCheck();

const pkg = '@ffmpeg-installer/ffmpeg';
let lib: FFMpegModule | undefined = await findPackage(pkg);

if (lib) {
	console.log(`ffmpeg-installer vers: ${lib.version}`)
	console.log(`path: ${lib.path}`)
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