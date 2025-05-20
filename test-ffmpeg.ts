import { execSync } from 'child_process';
import path from "path";
import { sliceMedia } from "./electron/ffmpeg/slice";


async function test() {

	try {

		const inFile = './test.mp4';
		const outFile = path.resolve('./', 'out.mp4');

		const cmd = await sliceMedia('./test.mp4',
			[
				{ id: crypto.randomUUID(), from: 10, to: 20.5 }
			],
			outFile);
		console.log(`cmd: ${cmd}`);

		const fullCmd = `ffmpeg -y -i ${inFile} -filter_complex ${cmd} ${outFile}`;
		console.log(`${fullCmd}`);

		const child = execSync(fullCmd);

	} catch (err) {
		console.error(err);
	}

}


test();