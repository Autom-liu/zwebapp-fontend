<template>
  <div class="home-container">
    <div class="box" @click="close">关闭</div>
    <div class="box" @click="changColumn">记一笔</div>
    <multi-picker :columns="columns" :isShow.sync="isShow" :default-current="defaultCurrent">
      <div class="box">弹出</div>
    </multi-picker>
  </div>
</template>

<script>
import MultiPicker from '@/components/Picker/MultiPicker';
export default {
  components: {
    MultiPicker,
  },
  data() {
    return {
      columns: [[], [], []],
      defaultCurrent: [1, 2, 3],
      isShow: false,
    };
  },
  mounted() {
    const arr = [];
    for (let i = 1; i <= 10; i++) {
      arr.push({ key: i, label: 2015 + i });
    }
    this.columns = [arr, arr, arr];
  },
  methods: {
    changColumn() {
      const arr = [];
      for (let i = 10; i <= 20; i++) {
        arr.push({ key: i, label: 2026 - i });
      }
      this.$set(this.columns, 2, arr);
    },
    close() {
      this.isShow = false;
    },
  },
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
