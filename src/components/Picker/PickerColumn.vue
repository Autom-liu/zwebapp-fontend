<template>
  <scroller
    :scroll-ref="scrollerRef"
    :startY="possy"
    :refresh.sync="refresh"
    wrapper-class="scroll-selected"
    @scroll-end="onScrollEnd"
    @scroll="onScroll"
  >
    <ul class="wrapper" ref="wrapper">
      <li
        v-for="(item, key) in column"
        :class="['item', itemStyle ? itemStyle[item[1].index] : '']"
        :key="key"
      >
        {{item[1][labelField]}}
      </li>
    </ul>
  </scroller>
</template>

<script>
import Scroller from '@/components/Scroller/Scroller';
import ArrayUtils from '@/assets/utils/ArrayUtils';

export default {
  name: 'PickerColumn',
  components: {
    Scroller,
  },
  props: {
    scrollerRef: {
      type: [String, Number],
      required: true,
    },
    column: {
      type: Map,
      required: true,
    },
    defaultCurrent: {
      type: [String, Number],
      required: true,
    },
    keyField: {
      type: String,
      required: true,
    },
    labelField: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      refresh: false,
      shouldChangeCurrent: true,
      liHeight: 0,
      possy: 0, // defaultCurrent -> possy -> currentIndex -> currents
    };
  },
  mounted() {
    this.initLiHeight();
    this.initPossy();
  },
  methods: {
    /**
     * 计算初始Li的高度
     */
    initLiHeight() {
      if (this.$refs.wrapper) {
        const ele = this.$refs.wrapper;
        const height = ele.clientHeight;
        this.liHeight = Math.ceil(height / ele.childElementCount);
      }
    },
    /**
     * 计算初始位置
     */
    initPossy() {
      const v = this.column.get(this.defaultCurrent);
      if (v) {
        this.possy = -this.liHeight * v.index;
      }
    },
    /**
     * 矫正滑动后的位置
     */
    getScrollFinalTop(scrollTop, liHeight) {
      if (Math.abs(scrollTop % liHeight) > (liHeight / 2)) {
        return Math.floor(scrollTop / liHeight) * liHeight;
      }
      return Math.ceil(scrollTop / liHeight) * liHeight;
    },
    /**
     * 响应滑动结束后事件
     */
    onScrollEnd([bs, pos, index]) {
      this.shouldChangeCurrent = true;
      const finalY = this.getScrollFinalTop(pos.y, this.liHeight);
      bs.scrollTo(pos.x, finalY, 0, undefined, undefined, true);
      this.possy = Math.min(Math.max(pos.y, -this.liHeight * (this.column.size - 1)), 0);
      this.$emit('column-change', this.currents, index);
    },
    /**
     * 响应滑动中事件
     */
    onScroll([bs, pos, index]) {
      this.shouldChangeCurrent = false;
      this.possy = Math.min(Math.max(pos.y, -this.liHeight * (this.column.size - 1)), 0);
    },
  },
  computed: {
    currentIndex() {
      return Math.abs(Math.round(this.possy / this.liHeight));
    },
    currents() {
      const entry = this.column.entries();
      const reallyIndex = Math.min(this.column.size - 1, this.currentIndex);
      for (let n = 0; n < reallyIndex; n++) {
        entry.next();
      }
      const e = entry.next().value;
      return e[1];
    },
    itemStyle() {
      const length = this.column.size;
      const arr = ArrayUtils.fill('dispear', length);
      const c = this.currentIndex;
      ArrayUtils.set(arr, c, 'selected');
      ArrayUtils.set(arr, c + 1, 'near');
      ArrayUtils.set(arr, c - 1, 'near');
      ArrayUtils.set(arr, c + 2, 'further');
      ArrayUtils.set(arr, c - 2, 'further');
      return arr;
    },
  },
  watch: {
    currents(val) {
      if (this.shouldChangeCurrent) {
        this.$emit('current-change', this.currents, this.scrollerRef);
      }
    },
    column(val, old) {
      if (val.size <= this.currentIndex) {
        // this.possy = this.resizePossy(val.size);
        this.refresh = true;
      }
    },
  },
};
</script>

<style>

</style>
