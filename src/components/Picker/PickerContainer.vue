<template>
  <div class="scroll-container">
      <div class="container-top">
        <i class="iconfont withdraw" @click.stop="withdraw">&#xe60a;</i>
      </div>
      <div class="scroll-box" v-for="(col, coli) in initColumn" :key="coli">
        <picker-column
          :scroller-ref="coli"
          :column="col"
          :key-field="keyField"
          :label-field="labelField"
          :defaultCurrent="defaultCurrent[coli]"
          @column-change="columnChange"
          @current-change="currentChange"
        />
      </div>
  </div>
</template>

<script>
import PickerColumn from './PickerColumn';
export default {
  name: 'picker-container',
  components: {
    PickerColumn,
  },
  props: {
    columns: {
      validator: arr => Array.isArray(arr) && arr.reduce((a, b, i) => a && Array.isArray(b), true),
      default: () => [[]],
    },
    keyField: {
      type: String,
      required: true,
    },
    labelField: {
      type: String,
      required: true,
    },
    defaultCurrent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      currents: [],
    };
  },
  created() {

  },
  methods: {
    columnChange(current, index) {
      this.$set(this.currents, index, current);
      this.$emit('column-change', this.currents, index);
    },
    currentChange(current, index) {
      this.$set(this.currents, index, current);
      this.$emit('current-change', this.currents);
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
  },
  watch: {

  },
};
</script>

<style lang="scss">
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
