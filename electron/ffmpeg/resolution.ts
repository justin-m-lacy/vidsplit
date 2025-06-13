import type { TResolution } from "../../shared/edits";
import { quoteStr } from "../files";

export function buildResolutionCmd(
	inUrl: string,
	outUrl: string,
	resolution: TResolution,
	audio: boolean = true) {

	return `ffmpeg -i ${quoteStr(inUrl)} -vf "scale=${resolution.width}:${resolution.height}" ${quoteStr(outUrl)}`;
}