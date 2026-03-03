import { unlink, writeFile } from 'fs/promises';
import * as path from 'path';
import { quoteStr } from '../util/text';
import { spawnFFMpeg } from "./spawn";

export async function concatMedia(inFiles: string[], outFile: string, tmpDir: string) {

	const args: string[] = ['-y'];

	const textFile = path.join(tmpDir, `${path.basename(outFile)}.txt`);

	// create temp input file.
	await writeFile(textFile, inFiles.map((p) =>
		`file '${p}'`
	).join('\n'), { encoding: 'utf8' })

	args.push(`-f concat -safe 0 -i ${textFile}`);
	args.push('-c copy', quoteStr(outFile))

	await spawnFFMpeg(args);

	// delete text file.
	unlink(textFile).catch();

	return outFile;
}