<template>
	<router-link :to="toPath">
		<div class="home-container">
				<div class="box">记一笔</div>
		</div>
	</router-link>
</template>

<script>

export default {

};
</script>

<style lang="scss">
.home-container {
	position: fixed;
	display: flex;
	flex-direction: column;
	align-content: center;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #92d2f7;
	.box {
		width: 2rem;
		line-height: 1rem;
		font-size: 16px;
		font-weight: 600;
		color: #fff;
		text-align: center;
		background-color: #fe9901;
		margin: auto;
	}
}
</style>
