<template>
  <div class="form-item">
    <label><i class="iconfont cate">&#xe600;</i>时间</label>
    <div class="input-box" @click="onpupup">
      <date-time-picker
        :is-show="isShow"
        :maxDate="new Date()"
        :defaultDate="selectedDate"
        @column-change="d => d"
        @withdraw="withdraw"
        v-slot="{currents}"
      >
        {{ viewShow(currents) }}
      </date-time-picker>
    </div>
    <div>
      <i class="iconfont close" @click="onremove">&#xe60a;</i>
    </div>
  </div>
</template>

<script>
import DateTimePicker from '@/components/Picker/DateTimePicker';

export default {
  props: {
    selectedDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  components: {
    DateTimePicker,
  },
  data() {
    return {
      isShow: false,
    };
  },
  methods: {
    onpupup() {
      this.isShow = true;
    },
    viewShow(currents) {
      return currents[2] ? `${currents[0].label} ${currents[1].label} ${currents[2].label}` : '';
    },
    onremove() {
      this.$emit('onremove');
    },
    withdraw(currentDate) {
      this.$emit('update:selectedDate', currentDate);
      this.isShow = false;
    },
  },
};
</script>

<style>

</style>
