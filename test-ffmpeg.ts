import { execSync } from 'child_process';
import path from "path";
import { buildSliceCmd } from "./electron/ffmpeg/slice";

testSlice();

/**
 * Test raw command.
 */
async function testSlice() {

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
