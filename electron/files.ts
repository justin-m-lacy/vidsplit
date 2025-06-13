import { extname } from "path";

export const quoteStr = (s: string) => { return `"${s}"` }

export const useExt = (outPath: string, inPath: string) => {
	if (extname(outPath) == '') {
		return outPath + extname(inPath);
	}
	return outPath;
}
