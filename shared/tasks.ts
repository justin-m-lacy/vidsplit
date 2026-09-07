export type TaskState = 'complete' | 'active' | 'failed' | 'canceled' | 'pending';

export type TaskUpdate = { id: string } &
	({ state: 'canceled' } | {
		state: Exclude<TaskState, 'pending'>,
	} | {
		state: 'complete',
		result: string
	} | { state: 'failed' });


export class TaskCanceledError extends Error {
	readonly taskId: string;
	constructor(taskId: string) {
		super('canceled');
		this.taskId = taskId;
	}
}