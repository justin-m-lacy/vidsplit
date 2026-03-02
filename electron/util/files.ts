import { existsSync } from 'fs';
import path, { join } from "path";

/**
 * If outpath is missing extension, add extension from inPath.
 * @param inPath - path whose extension should be copied.
 */
export function copyExt(outPath: string, inPath: string) {
	if (path.extname(outPath) == '') {
		return outPath + path.extname(inPath);
	}
	return outPath;
}

/**
 * @param base - base name of file.
 * @param ext - file extension with '.' included
 */
export function uniqueName(path: string, base: string, ext: string = '') {

	base = join(path, base);
	let n = 1;
	let unique = join(base, ext);

	while (existsSync(unique)) {
		unique = join(base, `(${n++})${ext}`);
	}

	return unique;

}