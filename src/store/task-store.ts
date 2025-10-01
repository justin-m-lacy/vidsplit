import { defineStore } from 'pinia';

export type TEditTask = {

	id: string,
	promise: Promise<any>,

	state: 'inactive' | 'active' | 'complete' | 'failed',

	/**
	 * current amount towards progress. any unit.
	 */
	current: number,
	/**
	 * total amount progress for task.
	 */
	total: number
}

export const useTaskStore = defineStore('progress', () => {

	const tasks = ref<Record<string, TEditTask>>(Object.create(null));

	// won't be available when testing only front-end.
	if (window.electron) {
		window.electron.onProgress((id: string, cur: number, total: number) => {

			const task = tasks.value[id];
			if (!task || task.state == 'complete' || task.state === 'failed') return;
			task.state = 'active';

			task.current = cur;
			task.total = total;

		});
	}

	function add<T extends any>(id: string, promise: Promise<T>): TEditTask {

		const task = tasks.value[id] = shallowReactive({
			id,
			promise,
			state: 'inactive',
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