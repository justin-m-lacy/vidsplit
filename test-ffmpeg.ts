import { execSync } from 'child_process';
import path from "path";
import { buildSliceCmd, sliceMedia } from "./electron/ffmpeg/slice";


async function test() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		await sliceMedia(inFile,
			[
				{ id: crypto.randomUUID(), from: 10, to: 20.5 }
			],
			outFile);

	} catch (err) {
		console.error(err);
	}

}


testRaw();


/**
 * Test raw command.
 */
async function testRaw() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		const cmd = await buildSliceCmd(inFile,
			[
				{ id: crypto.randomUUID(), from: 10, to: 11.5 },
				{ id: crypto.randomUUID(), from: 1, to: 2 }
			],
			outFile);

		const fullCmd = `ffmpeg -y -i ${inFile} -filter_complex ${cmd} ${outFile}`;
		console.log(`${fullCmd}`);

		execSync(fullCmd);

	} catch (err) {
		console.error(err);
	}

}
