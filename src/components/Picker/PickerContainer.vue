<template>
  <div class="picker-container">
    <div class="scroll-contain" v-for="(col, coli) in initColumn" :key="coli">
      <div class="scroll-selected" ref="scroll">
        <ul class="wrapper" ref="wrapper">
          <li
            v-for="(item, key) in col"
            :class="['item', itemStyle[coli] ? itemStyle[coli][item[1].index] : '']"
            :key="key"
          >
            {{item[1].label}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import ArrayUtils from '@/assets/utils/ArrayUtils';
export default {
  name: 'picker-container',
  props: {
    columns: {
      validator: arr => Array.isArray(arr) && arr.reduce((a, b, i) => a && Array.isArray(b), true),
      default: () => [[]],
    },
    keyField: {
      type: String,
      default: 'key',
    },
    labelField: {
      type: String,
      default: 'label',
    },
    defaultCurrent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      firstLoad: false,
      bs: [], // better-score
      poss: [], // 存放每条滚动位置信息
      scrollers: [], // 存放每条初始高度信息
      // currents: [], // 计算属性：存放每条当前选择信息
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroller();
      this.initBs();
      this.initPoss();
    });
    this.firstLoad = true;
  },
  methods: {
    initBs() {
      const defaultIndex = this.defaultCurrent.map((k, i) => this.initColumn[i].get(k));
      console.log(defaultIndex);
      this.bs = this.$refs.scroll.map((v, i) => new BScroll(v, {
        scrollY: true,
        startY: -defaultIndex[i].index * this.scrollers[i],
        click: true,
        probeType: 3,
      }));
      this.bs.forEach((v, i) => v.on('scrollEnd', pos => this.onScrollEnd(v, pos, i)));
      this.bs.forEach((v, i) => v.on('scroll', pos => this.onScroll(v, pos, i)));
    },
    initPoss() {
      this.poss = this.bs.map(bs => bs.y);
    },
    initScroller() {
      this.scrollers = this.$refs.wrapper.map((ele) => {
        const height = ele.clientHeight;
        const liHeight = Math.ceil(height / ele.childElementCount);
        return liHeight;
      });
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
    onScrollEnd(bs, pos, index) {
      const finalY = this.getScrollFinalTop(pos.y, this.scrollers[index]);
      bs.scrollTo(pos.x, finalY, 0, undefined, undefined, true);
      this.$emit('column-change', this.currents, index);
    },
    onScroll(bs, pos, index) {
      this.$set(this.poss, index, pos.y);
    },
    isMapEquals(map1, map2) {
      if (map1.size !== map2.size) {
        return false;
      }
      for (const key of map1.keys()) {
        if (!map2.has(key)) {
          return false;
        }
      }
      return true;
    },
  },
  computed: {
    initColumn() {
      return this.columns.map((c) => {
        const map = new Map();
        c.forEach((v, i) => {
          const value = { key: v[this.keyField], label: v[this.labelField], index: i };
          map.set(value.key, value);
        });
        return map;
      });
    },
    currIndex() {
      return this.poss.map((y, i) => {
        const liHeight = this.scrollers[i];
        const curIndex = Math.abs(Math.round(y / liHeight));
        return curIndex;
      });
    },
    currents() {
      return this.currIndex.map((c, i) => {
        const entry = this.initColumn[i].entries();
        for (let n = 0; n < c; n++) {
          entry.next();
        }
        return entry.next().value[1];
      });
    },
    // 样式变化
    itemStyle() {
      return this.currIndex.map((c, i) => {
        const length = this.initColumn[i].size;
        const arr = ArrayUtils.fill('dispear', length);
        ArrayUtils.set(arr, c, 'selected');
        ArrayUtils.set(arr, c + 1, 'near');
        ArrayUtils.set(arr, c - 1, 'near');
        ArrayUtils.set(arr, c + 2, 'further');
        ArrayUtils.set(arr, c - 2, 'further');
        return arr;
      });
    },
  },
  watch: {
    initColumn(val, old) {
      for (let i = 0; i < val.length; i++) {
        if (!this.isMapEquals(val[i], old[i])) {
          this.$emit('column-change', this.currents, i);
          break;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
  $darkFont: #333;
  $liHeight: 0.96rem;
  $bgc: #ebebeb;

.picker-container {
  display: flex;
  flex-direction: row;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  padding: 0.4rem 0;
  height: $liHeight * 5;
  background-color: $bgc;
  .scroll-contain {
    flex: 1;
    color: $darkFont;
    text-align: center;
    overflow: hidden;
    padding: $liHeight * 2 0;
    .scroll-selected {
      height: $liHeight;
      background-color: #fff;
      .wrapper {
        .item {
          min-height: $liHeight;
          line-height: $liHeight;
          &.dispear {
            opacity: 0;
          }
          &.further {
            opacity: 0.6;
            transform: scale(0.8);
          }
          &.near {
            opacity: 0.8;
          }
          &.selected {
            opacity: 1;
            transform: scale(1.2);
          }
        }
      }
    }
  }
}
</style>
