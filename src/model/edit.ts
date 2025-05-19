import type { TMediaInfo } from "@/model/media"

export type TEditMode = {

	id: string,

	canUse: boolean | ((media: TMediaInfo) => boolean)

}