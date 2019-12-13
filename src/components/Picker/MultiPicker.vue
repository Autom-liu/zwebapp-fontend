<template>
  <div id="picker" @click.stop="onShow">
    <slot :currents="currents"></slot>
    <div class="mask" v-if="isShow"></div>
    <drawer>
      <picker-container
        v-if="isShow"
        :columns="columns"
        :key-field="keyField"
        :label-field="labelField"
        :default-current="defaultCurrent"
        @column-change="columnChange"
        @current-change="currentChange"
        @withdraw="withdraw"
      />
    </drawer>
  </div>
</template>

<script>
import Drawer from '../Drawer';
import PickerContainer from './PickerContainer';

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
  components: {
    Drawer,
    PickerContainer,
  },
  data() {
    return {
      currents: [],
    };
  },
  methods: {
    onShow() {
      this.$emit('onpopup');
      this.$emit('update:isShow', true);
    },
    currentChange(currents) {
      this.currents = currents;
    },
    columnChange(currents, index) {
      this.currents = currents;
      this.$emit('column-change', this.currents, index);
    },
    withdraw(currents) {
      this.currents = currents;
      this.$emit('withdraw', this.currents);
      this.$emit('update:isShow', false);
    },
  },
};
</script>

<style lang="scss">

#picker {
  width: 100%;
  height: 100%;
}
.mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background-color: rgba(55, 55, 55, .5);
}
</style>
