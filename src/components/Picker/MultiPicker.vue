<template>
  <div id="picker" @click.stop="onShow">
    <slot :current-index="currents"></slot>
    <drawer>
      <div v-show="isShow" class="picker-container">
        <div class="scroll-contain" v-for="(col, coli) in columns" :key="coli">
          <div class="scroll-selected" ref="scroll">
            <ul class="wrapper" ref="wrapper">
              <li
                :class="['item', itemStyle[coli] ? itemStyle[coli][index] : '']"
                v-for="(item, index) in col"
                :key="item[keyField]"
              >
                {{item[labelField]}}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
import Drawer from '../Drawer';

export default {
  name: 'picker',
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
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
      default: () => [0],
    },
  },
  components: {
    Drawer,
  },
  data() {
    return {
      firstLoad: true,
      bs: [], // better-score
      poss: [], // 存放每条滚动位置信息
      scrollers: [], // 存放每条初始高度信息
      currents: [], // 存放每条当前选择信息
    };
  },
  methods: {
    initBs() {
      this.bs = this.$refs.scroll.map((v, i) => new BScroll(v, {
        scrollY: true,
        startY: -this.defaultCurrent[i] * this.scrollers[i].liHeight,
        click: true,
        probeType: 3,
      }));
      this.bs.forEach((v, i) => v.on('scrollEnd', pos => this.onScrollEnd(v, pos, i)));
      this.bs.forEach((v, i) => v.on('scroll', pos => this.onScroll(v, pos, i)));
    },
    initPoss() {
    },
    refreshScroller() {
    },
    refreshCurrent() {
    },
    onShow() {
      this.$emit('update:isShow', true);
    },
    getScrollFinalTop(scrollTop, liHeight) {
      if (Math.abs(scrollTop % liHeight) > (liHeight / 2)) {
        return Math.floor(scrollTop / liHeight) * liHeight;
      }
      return Math.ceil(scrollTop / liHeight) * liHeight;
    },
    onScrollEnd(bs, pos, index) {
      const finalY = this.getScrollFinalTop(pos.y, this.scrollers[index].liHeight);
      bs.scrollTo(pos.x, finalY, 500);
      this.refreshCurrent();
      this.$emit('column-change', this.currents, index);
    },
    onScroll(bs, pos, index) {
      this.$set(this.poss, index, pos);
      this.refreshCurrent();
    },
  },
  computed: {
    // 样式变化
    itemStyle() {
      return this.currents.map((v, i) => v);
    },
  },
  watch: {
    isShow(val, old) {

    },
    columns(val, old) {

    },
  },
};
</script>

<style lang="scss">

  @import '@/assets/style/varibles.scss';
  $liHeight: 0.96rem;
  $bgc: #ebebeb;

#picker {
  width: 100%;
  height: 100%;
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
}
</style>
