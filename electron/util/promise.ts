/**
 * simultanous limit for a file operation.
 */
export function pLimit(n: number = 10) {

	let active: number = 0;

	let queue: Array<{
		res: (data: any) => void,
		rej: (err: any) => void,
		// function to start operation.
		fn: () => Promise<any>
	}> = [];

	async function work() {

		while (queue.length > 0) {
			const item = queue.shift();
			if (!item) continue;

			try {
				const res = await item.fn();
				item.res(res);
			} catch (err) {
				item.rej(err);
			}
		}
		active--;

	}

	return function <T extends any>(op: () => Promise<T>) {

		const p = new Promise<T>((res, rej) => {

			queue.push({
				res,
				rej,
				fn: op
			})
		});

		if (active < n) {
			active++;
			work();
		}

		return p;

	}

}