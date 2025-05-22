<script setup lang="ts">

const prop = defineProps<{
	/**
	 * time in seconds.
	 */
	time:number
}>();

const padNum = (n:number)=>{
	return n.toString().padStart(2, '0');
}

const ms = shallowRef<number>(0);
const mins = shallowRef<number>(0);
const secs = shallowRef<number>(0);
const hrs = shallowRef<number>(0);
watch(()=>prop.time, (time)=>{

	ms.value = Math.round( 1000*(time - Math.floor(time) ) );

	secs.value = Math.floor( time % 60 );

	hrs.value = Math.floor( time / 3600 );
	if ( hrs.value <=2 ) hrs.value = 0;

	mins.value = Math.floor(time/60) - 60*hrs.value;

});

</script>
<template>
	<div class="flex items-start">
		<span v-if="hrs>0">{{padNum(hrs)}}:</span>
		{{padNum(mins)}}:{{padNum(secs)}}:{{ms.toString().padEnd(3,'0')}}</div>
</template>