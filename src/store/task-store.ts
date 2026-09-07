import { defineStore } from 'pinia';
import { TaskState, TaskUpdate } from '../../shared/tasks';

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

	const currentId = shallowRef<string | null>(null);
	const current = computed(() => currentId.value ? tasks.value[currentId.value] : null);

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

	function runTask<T extends TaskUpdate>(id: string, task: () => Promise<T>) {

		return task().then((res) => {

			const t = tasks.value[id];
			if (!t) return res;

			t.state = res.state;

			if (res.state == 'canceled') {
				remove(res.id);
			} else {
				t.current = t.total;
			}

		}).catch((e) => {

			const t = tasks.value[id];
			if (t) {
				t.state = 'failed';
			}

			return undefined;

		});

	}

	function add<T extends TaskUpdate>(id: string, task: () => Promise<T>): TEditTask {

		const info = tasks.value[id] = shallowReactive({
			id,
			promise: runTask(id, task),
			state: 'pending',
			current: 0,
			total: 0
		});

		currentId.value = id;

		return info;

	}

	function remove(id: string) {
		if (currentId.value == id) {
			currentId.value = null;
		}
		delete tasks.value[id];
	}

	return {
		add,
		remove,
		current,
		get busy() {
			for (const id in tasks.value) {
				if (!TaskDone(tasks.value[id])) {
					return true;
				}
			}
			return false;
		},
		get(id: string) { return tasks.value[id] },
		tasks
	}

});