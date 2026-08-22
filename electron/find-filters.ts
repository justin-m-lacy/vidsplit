import { pLimit } from 'electron/util/promise';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
const FiltersDir = './filters/'

type FilterInfo = {
	type: string,
	content: string,
	name?: string
}

/**
 * Find all curve files stored at path.
 */
export async function getFilterList() {

	const limit = pLimit();

	const entries = (await readdir(FiltersDir, { withFileTypes: true })).filter(e => e.isFile());
	const loads = entries.map((v) => limit(() => loadFilterData(path.join(v.parentPath, v.name))));

	return Promise.all(loads);

}

export async function loadFilterData(filePath: string) {

	try {

		const data = await readFile(filePath, { flag: 'r', encoding: 'utf-8' });
		return JSON.parse(data) as FilterInfo;

	} catch (err) {
		console.warn(err);
		throw err;
	}


}