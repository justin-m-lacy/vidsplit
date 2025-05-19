import type * as stream from "stream";


let curVideo: string | stream.Readable | null = null;

export function setCurrent(source: string | stream.Readable) {
	curVideo = source;
}


export function sliceVideo(from: number, to: number) {

}