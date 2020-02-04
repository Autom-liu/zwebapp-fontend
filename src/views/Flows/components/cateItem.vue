<template>
  <div class="form-item">
    <label><i class="iconfont cate">&#xe600;</i>分类</label>
    <div class="input-box" @click="onpupup">
      <picker
        :columns="catePicker"
        :is-show="isShow"
        :key-field="keyField"
        :label-field="labelField"
        :default-current="defaultCurrent"
        @column-change="cateColumnChange"
        @withdraw="withdraw"
        v-slot=" {currents} "
      >
        {{ viewShow(currents) }}
      </picker>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Picker from '@/components/Picker/MultiPicker';

export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    selectedCate: {
      type: Array,
      required: true,
    },
  },
  components: {
    Picker,
  },
  data() {
    return {
      catePicker: [[], []],
      isShow: false,
      defaultCurrent: [0, 0],
      keyField: 'cateId',
      labelField: 'cateName',
    };
  },
  methods: {
    ...mapActions(['initCateList']),
    viewShow(currents) {
      return (currents[0] && currents[1] ? `${currents[0].cateName} - ${currents[1].cateName}` : '');
    },
    onpupup() {
      this.isShow = true;
    },
    /**
     * 初始化分类列表数据
     */
    initCateSelection() {
      const firstCate = this.getCateByPid(0);
      const nextCate = this.getCateByPid(firstCate[0].cateId);
      this.catePicker = [firstCate, nextCate];
      this.defaultCurrent = [firstCate[0].cateId, nextCate[0].cateId];
    },
    /**
     * 监听分类数据滚动变化
     */
    cateColumnChange(currents, index) {
      let nextCate = currents[1];
      if (index === 0) {
        nextCate = this.getCateByPid(currents[index].cateId);
        this.$set(this.catePicker, 1, nextCate);
      }
    },
    withdraw(currents) {
      this.$emit('update:selectedCate', currents);
      this.defaultCurrent = [currents[0].cateId, currents[1].cateId];
      this.isShow = false;
    },
  },
  computed: {
    ...mapGetters(['cateList', 'getCateByPid']),
  },
  watch: {
    async type(val, old) {
      if (this.type) {
        await this.initCateList(this.type);
        this.initCateSelection();
      }
    },
  },
};
</script>

<style>

</style>
