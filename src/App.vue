<template>
  <div id="app">
		<keep-alive>
			<router-view/>
		</keep-alive>
  </div>
</template>

<script>

export default {
  name: 'App',
};
</script>

<style scoped>
#app {
	font-family: 'microsoft Yahei', 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}
</style>
