<template>
  <div id="picker" @click.stop="onShow">
    <slot :currents="currents"></slot>
    <drawer>
      <picker-container
        v-if="isShow"
        :columns="columns"
        :key-field="keyField"
        :label-field="labelField"
        :default-current="defaultCurrent"
        @column-change="columnChange"
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
      this.$emit('update:isShow', true);
    },
    columnChange(currents, index) {
      console.log(currents, index);
      this.currents = currents;
      this.$emit('column-change', this.currents, index);
    },
  },
};
</script>

<style lang="scss">

#picker {
  width: 100%;
  height: 100%;
}
</style>
