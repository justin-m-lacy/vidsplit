import type { SetupContext } from 'vue';

function CutPoint(props: { selected?: boolean }, context: SetupContext) {

	return h('div', {
		...context.attrs,
		class: ['flex flex-col justify-stretch items-center -translate-x-1/2', context.attrs.class],

	}, [

		h('div', {
			class: ["w-3 h-2",
				props.selected ? 'bg-green-500' : 'bg-orange-400'],
			style: { clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }
		}),
		h('div', { class: 'grow w-[1px] bg-black shadow-sm m-0 p-0' }),
		h('div', {
			class: ["w-3 h-2",
				props.selected ? 'bg-green-500' : 'bg-orange-400'],
			style: { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }
		})

	]);
};

export default CutPoint;