import { defineStore } from 'pinia';
import { TaskState, TaskUpdate } from 'shared/types';

export type TEditTask = {

	id: string,
	promise: Promise<any>,

	state: TaskState,

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

	function TaskDone(task?: TEditTask) {
		return task == null || (task.state !== 'pending' && task.state !== 'active');
	}

	// window.electron won't exist when testing front-end only.
	window.electron?.onProgress((id: string, cur: number, total: number) => {

		const task = tasks.value[id];
		if (TaskDone(task)) return;
		task.state = 'active';

		task.current = cur;
		task.total = total;

	});

	window.electron?.onTaskState((info: TaskUpdate) => {

		const task = tasks.value[info.id];
		if (TaskDone(task)) return;

		task.state = info.state;
		if (task.state === 'canceled') {
			remove(task.id);
		}


	});

	function add<T extends any>(id: string, promise: Promise<T>): TEditTask {

		const task = tasks.value[id] = shallowReactive({
			id,
			promise,
			state: 'pending',
			current: 0,
			total: 0
		});

		promise.catch(() => {
			const t = tasks.value[id];
			if (t) t.state = 'failed'
		});

		return task;

	}

	function remove(id: string) {
		console.log(`remove task: ${id}`);
		delete tasks.value[id];
	}

	return {
		add,
		remove,
		get busy() {
			for (const id in tasks.value) {
				const task = tasks.value[id];
				if (task.state == 'active' || task.state == 'pending')
					return true;
			}
			return false;
		},
		get(id: string) { return tasks.value[id] },
		tasks
	}

});