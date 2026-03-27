import { defineStore } from 'pinia';

export type TEditTask = {

	id: string,
	promise: Promise<any>,

	state: 'pending' | 'active' | 'complete' | 'failed',

	/**
	 * current progress towards complete. any unit.
	 */
	current: number,
	/**
	 * total progress for task to be complete.
	 */
	total: number
}

export const useTaskStore = defineStore('progress', () => {

	const tasks = ref<Record<string, TEditTask>>(Object.create(null));

	// window.electron won't exist when testing front-end only.
	window.electron?.onProgress((id: string, cur: number, total: number) => {

		const task = tasks.value[id];
		if (!task || task.state == 'complete' || task.state === 'failed') return;
		task.state = 'active';

		task.current = cur;
		task.total = total;

	});

	function add<T extends any>(id: string, promise: Promise<T>): TEditTask {

		const task = tasks.value[id] = shallowReactive({
			id,
			promise,
			state: 'pending',
			current: 0,
			total: 0
		});

		promise.then(() => {
			const t = tasks.value[id];
			if (t) {
				t.state = 'complete';
				t.current = t.total;
			}
		}).catch(() => {
			const t = tasks.value[id];
			if (t) t.state = 'failed'
		});

		return task;

	}

	function remove(id: string) {
		delete tasks.value[id];
	}

	return {
		add,
		remove,
		get(id: string) { return tasks.value[id] },

		tasks
	}

});