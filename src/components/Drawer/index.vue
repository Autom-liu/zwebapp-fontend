<template>
	<transition name="drawer">
		<slot></slot>
	</transition>
</template>

<script>
export default {
  name: 'drawer',
};
</script>

<style lang="scss" scoped>
	.drawer-enter, .drawer-leave-to {
		transform: translateY(100%)
	}
	.drawer-enter-active, .drawer-leave-active {
		transition: transform .5s;
	}
</style>
