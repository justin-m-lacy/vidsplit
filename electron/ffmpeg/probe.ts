import { execSync } from "child_process";
import { quoteStr } from "../files";

export function probeTypes(file: string) {

	const cmd = `ffprobe -v error -show_entries stream=codec_type,codec_name -of default=noprint_wrappers=1:nokey=1 ` + quoteStr(file);

	const result = execSync(cmd).toString('utf-8');

	const arr: { codec: string, kind: string }[] = [];
	if (result) {


		const parts = result.split(/(\w+)(?:\r?\n)/i).filter(v => v != '');
		for (let i = 0; i < parts.length; i += 2) {

			arr.push({
				codec: parts[i],
				kind: parts[i + 1]
			});
		}

	}

	return arr;

}

export function probeFull(file: string) {

	const cmd = 'ffprobe -v error -show_entries stream -of json ' + quoteStr(file);
	const result = execSync(cmd);


}