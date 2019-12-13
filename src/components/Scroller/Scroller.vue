<template>
  <div :class="wrapperClass" :ref="scrollRef">
    <slot />
  </div>
</template>

<script>
import BScroll from '@better-scroll/core';
export default {
  name: 'scroller',
  props: {
    startY: Number,
    scrollRef: [String, Number],
    wrapperClass: String,
    refresh: Boolean,
  },
  data() {
    return {
      bs: null,
      lastHeight: 0,
    };
  },
  updated() {
    if (this.refresh) {
      this.bs.refresh();
      this.$emit('update:refresh', false);
    }
  },
  mounted() {
    this.$nextTick(() => {
      const el = this.$refs[this.scrollRef];
      this.bs = new BScroll(el, {
        scrollY: true,
        startY: this.startY,
        click: true,
        probeType: 3,
        bindToWrapper: true,
      });
      this.bs.on('scrollEnd', pos => this.onScrollEnd(pos));
      this.bs.on('scroll', pos => this.onScroll(pos));
    });
  },
  methods: {
    onScrollEnd(pos) {
      this.$emit('scroll-end', [this.bs, pos, this.scrollRef]);
    },
    onScroll(pos) {
      if (!this.refresh) {
        this.$emit('scroll', [this.bs, pos, this.scrollRef]);
      }
    },
    checkRefresh() {
      return true;
    },
  },
  watch: {
    refresh(val, old) {

    },
  },
};
</script>

<style lang="sass">

</style>
