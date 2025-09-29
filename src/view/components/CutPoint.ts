import type { SetupContext } from 'vue';

function CutPoint(props: any, context: SetupContext) {

	console.log(`ctxT: ${context.attrs.class} ${typeof context.attrs.class}`);
	return h('div', {
		...context.attrs,
		class: 'flex flex-col justify-stretch items-center' + context.attrs.class,

	}, [

		h('div', {
			class: "w-3 h-2 bg-orange-400 -translate-x-1/2",
			style: { clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }
		}),
		h('div', { class: 'grow w-[1px] -translate-x-1/2 bg-black m-0 p-0' }),
		h('div', {
			class: "w-3 h-2 bg-orange-400 -translate-x-1/2",
			style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
		})

	]);
};

export default CutPoint;