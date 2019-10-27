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
  },
  data() {
    return {
      cutdown: false,
      bs: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.bs = new BScroll(this.$refs[this.scrollRef], {
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
      if (!this.cutdown) {
        this.cutdown = true;
        this.$emit('scroll', [this.bs, pos, this.scrollRef]);
        setTimeout(() => { this.cutdown = false; }, 50);
      }
    },
  },
};
</script>

<style lang="sass">

</style>
