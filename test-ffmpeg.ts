import { execSync } from 'child_process';
import path from "path";
import { buildSliceCmd } from "./electron/ffmpeg/slice";


testRawAuto();

/**
 * Test raw command.
 */
async function testRaw() {

	try {

		const inFile = './test.webm';
		const outFile = path.resolve('./', 'out.webm');

		const cmd = await buildSliceCmd(
			[
				{ id: crypto.randomUUID(), from: 10, to: 11.5 },
				{ id: crypto.randomUUID(), from: 1, to: 2 }
			],
			inFile,
			outFile);

		const fullCmd = `ffmpeg -y -i ${inFile} -filter_complex ${cmd} ${outFile}`;
		console.log(`${fullCmd}`);

		execSync(fullCmd);

	} catch (err) {
		console.error(err);
	}

}


/**
 * Test raw command.
 */
async function testRawAuto() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		const cmd = await buildSliceCmd(
			[
				{ id: crypto.randomUUID(), from: 12, to: 14.5 },
				{ id: crypto.randomUUID(), from: 1, to: 2 }
			],
			inFile,
			outFile);

		execSync(cmd);

	} catch (err) {
		console.error(err);
	}

}
