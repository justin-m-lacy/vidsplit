import path from "path";
import { probeTypes } from './electron/ffmpeg/probe';

//testSlice();
testProbe();

function testProbe() {

	const res = probeTypes('test.mp4');
	console.log(res);
}

/**
 * Test raw command.
 */
async function testSlice() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		/*const cmd = await buildSliceCmd(
			[
				{ id: crypto.randomUUID(), from: 12, to: 14.5 },
				{ id: crypto.randomUUID(), from: 1, to: 2 }
			],
			inFile,
			outFile);

		execSync(cmd);*/

	} catch (err) {
		console.error(err);
	}

}
