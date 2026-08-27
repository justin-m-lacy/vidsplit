import { probeTypes } from './electron/ffmpeg/probe';
//import { saveSlicesComplex } from "./electron/ffmpeg/slice";

//testSlice();
testProbe();

function testProbe() {

	const res = probeTypes('test.mp4');
	console.log(res);
}

/**
 * Test raw command.
 */
/*async function testSlice() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		const op = await saveSlicesComplex(
			[
				{ id: crypto.randomUUID(), from: 12, to: 14.5 },
				{ id: crypto.randomUUID(), from: 1, to: 2 }
			],
			inFile,
			outFile);

	} catch (err) {
		console.error(err);
	}

}*/
