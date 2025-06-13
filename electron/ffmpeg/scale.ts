import type { TResolution } from "../../shared/edits";
import { quoteStr } from "../files";

/**
 * create ffmpeg option switch for changing resolution.
 * @param resolution 
 */
export function addScaleOpt(resolution: TResolution) {
	return `"scale=${resolution.width}:${resolution.height}"`;
}

export function buildResolutionCmd(
	inUrl: string,
	outUrl: string,
	scale: TResolution,
	audio: boolean = true) {

	return `ffmpeg -i ${quoteStr(inUrl)} -vf ${addScaleOpt(scale)} ${quoteStr(outUrl)}`;
}