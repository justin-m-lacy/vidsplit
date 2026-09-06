export type TaskState = 'complete' | 'active' | 'failed' | 'canceled' | 'pending';

export type TaskUpdate = { id: string } &
	({ state: 'canceled' } | {
		state: Exclude<TaskState, 'pending' | 'canceled'>,
	} | {
		state: 'complete',
		result: string
	} | { state: 'failed' });