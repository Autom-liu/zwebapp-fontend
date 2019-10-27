<template>
  <div class="scroll-container">
      <div class="container-top">
        <i class="iconfont withdraw" @click.stop="withdraw">&#xe60a;</i>
      </div>
      <div class="scroll-box" v-for="(col, coli) in initColumn" :key="coli">
        <scroller
          :scroll-ref="coli"
          :startY="possy[coli]"
          :refresh.sync="refresh"
          wrapper-class="scroll-selected"
          @scroll-end="onScrollEnd"
          @scroll="onScroll"
        >
          <ul class="wrapper" ref="wrapper">
            <li
              v-for="(item, key) in col"
              :class="['item', itemStyle[coli] ? itemStyle[coli][item[1].index] : '']"
              :key="key"
            >
              {{item[1][labelField]}}
            </li>
          </ul>
        </scroller>
      </div>
  </div>
</template>

<script>
import Scroller from '@/components/Scroller/Scroller';
import ArrayUtils from '@/assets/utils/ArrayUtils';
export default {
  name: 'picker-container',
  components: {
    Scroller,
  },
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
      possy: [], // defaultCurrent -> possy -> currentIndex -> currents
      refresh: false,
      startY: 0,
      liHeight: 0,
    };
  },
  mounted() {
    this.initLiHeight();
    this.initPossy();
    this.$emit('column-change', this.currents);
  },
  methods: {
    /**
     * 计算初始Li的高度
     */
    initLiHeight() {
      if (this.$refs.wrapper) {
        const ele = this.$refs.wrapper[0];
        const height = ele.clientHeight;
        this.liHeight = Math.ceil(height / ele.childElementCount);
      }
    },
    /**
     * 计算初始位置
     */
    initPossy() {
      this.possy = this.defaultCurrent.map((k, i) => {
        const v = this.initColumn[i].get(k);
        if (!v) return 0;
        const index = v.index;
        return -this.liHeight * index;
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
    /**
     * 响应滑动结束后事件
     */
    onScrollEnd([bs, pos, index]) {
      const finalY = this.getScrollFinalTop(pos.y, this.liHeight);
      bs.scrollTo(pos.x, finalY, 0, undefined, undefined, true);
      this.$set(this.possy, index, pos.y);
      this.$emit('column-change', this.currents, index);
    },
    /**
     * 响应滑动中事件
     */
    onScroll([bs, pos, index]) {
      this.$set(this.possy, index, pos.y);
    },
    /**
     * 响应关闭后事件
     */
    withdraw() {
      this.$emit('withdraw', this.currents);
    },
  },
  computed: {
    initColumn() {
      return this.columns.map((c, k) => {
        const map = new Map();
        c.forEach((v, i) => {
          const value = { ...v, index: i };
          map.set(v[this.keyField], value);
        });
        return map;
      });
    },
    currentIndex() {
      return this.possy.map((y) => {
        const curIndex = Math.abs(Math.round(y / this.liHeight));
        return curIndex;
      });
    },
    currents() {
      return this.currentIndex.map((c, i) => {
        const entry = this.initColumn[i].entries();
        for (let n = 0; n < c; n++) {
          entry.next();
        }
        const e = entry.next().value;
        return e[1];
      });
    },
    /**
     * 样式变化
     */
    itemStyle() {
      return this.currentIndex.map((c, i) => {
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
      this.$forceUpdate();
      this.$emit('column-change', this.currents);
    },
  },
};
</script>

<style lang="scss" scoped>
  $darkFont: #333;
  $liHeight: 0.96rem;
  $bgc: #ebebeb;
.scroll-container {
  display: flex;
  flex-direction: row;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 9;
  padding: 0.4rem 0;
  height: $liHeight * 5;
  background-color: $bgc;
  .container-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9;
    .withdraw {
      float: right;
      margin-right: 0.28rem;
    }
  }
  .scroll-box {
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
