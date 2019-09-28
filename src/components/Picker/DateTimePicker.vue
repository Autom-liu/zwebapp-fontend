<template>
  <multiPicker
    :is-show.sync="show"
    :columns="columns"
    :key-field="keyField"
    :label-field="labelField"
    :default-current="defaultCurrent"
    @column-change="onColumnChange"
    @onpopup="onpopup"
  >
    <template scope="{ currents }">
      <slot :currents="currents"></slot>
    </template>
  </multiPicker>
</template>

<script>
import MultiPicker from './MultiPicker';
export default {
  props: {
    isShow: {
      type: Boolean,
      required: true,
    },
    minDate: {
      type: Date,
      default: () => new Date('1870-01-01 00:00:00'),
    },
    maxDate: {
      type: Date,
      default: () => new Date('2050-12-31 23:59:59'),
    },
    defaultDate: {
      type: Date,
      default: () => new Date(),
    },
  },
  data() {
    return {
      show: false,
      columns: [[], [], []],
      keyField: 'key',
      labelField: 'label',
      now: new Date(),
      defaultYearIndex: 0,
      defaultMonthIndex: 0,
      defaultDayIndex: 0,
      defaultCurrent: [],
      dayMap: {
        1: 31,
        2: 28,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      },
    };
  },
  methods: {
    initYear() {
      const minYear = this.minDate.getFullYear();
      const maxYear = this.maxDate.getFullYear();
      const arr = [];
      // eslint-disable-next-line no-plusplus
      for (let y = minYear; y <= maxYear; y++) {
        arr.push({ key: y, label: `${y}年` });
      }
      return arr;
    },
    initMonth() {
      const arr = [];
      // eslint-disable-next-line no-plusplus
      for (let m = 1; m <= 12; m++) {
        arr.push({ key: m, label: `${m}月` });
      }
      return arr;
    },
    initDay() {
      const day = [];
      // eslint-disable-next-line no-plusplus
      for (let d = 1; d <= 31; d++) {
        day.push({ key: d, label: `${d}日` });
      }
      return day;
    },
    initDefault() {
      const year = this.defaultDate.getFullYear();
      const month = this.defaultDate.getMonth() + 1;
      const date = this.defaultDate.getDate();
      return [year, month, date];
    },
    onColumnChange(p, i) {
      const year = p[0].key;
      const month = p[1].key;
      const date = p[2].key;
      if (i === 0) {
        this.columns = [this.columns[0], this.getMonthRange(year), this.getDayRange(year, month)];
      } else if (i === 1) {
        this.$set(this.columns, 2, this.getDayRange(year, month));
      }
      this.$emit('column-change', new Date(`${year}-${month}-${date}`));
    },
    getMonthRange(year) {
      const arr = [];
      const minMonth = year === this.minDate.getFullYear() ? this.minDate.getMonth() + 1 : 1;
      const maxMonth = year === this.maxDate.getFullYear() ? this.maxDate.getMonth() + 1 : 12;
      // eslint-disable-next-line no-plusplus
      for (let m = minMonth; m <= maxMonth; m++) {
        arr.push({ key: m, label: `${m}月` });
      }
      return arr;
    },
    getDayRange(year, month) {
      const arr = [];
      if (this.isSameYearMonth(year, month, this.minDate)) {
        const minDate = this.getBounceDate(year, month, this.minDate);
        for (let i = minDate; i <= this.dayMap[month]; i++) {
          arr.push({ key: i, label: `${i}日` });
        }
      } else if (this.isSameYearMonth(year, month, this.maxDate)) {
        const maxDate = this.getBounceDate(year, month, this.maxDate);
        for (let i = 1; i <= maxDate; i++) {
          arr.push({ key: i, label: `${i}日` });
        }
      } else {
        for (let i = 1; i <= this.dayMap[month]; i++) {
          arr.push({ key: i, label: `${i}日` });
        }
      }

      return arr;
    },
    getBounceDate(year, month, date) {
      const isSame = this.isSameYearMonth(year, month, date);
      return isSame ? date.getDate() : this.dayMap[month];
    },
    isSameYearMonth(year, month, date) {
      return year === date.getFullYear() && month === date.getMonth() + 1;
    },
    onpopup() {
      this.$emit('onpopup');
    },
  },
  mounted() {
    this.columns = [this.initYear(), this.initMonth(), this.initDay()];
    this.defaultCurrent = this.initDefault();
  },
  components: {
    MultiPicker,
  },
  watch: {
    isShow(val) {
      this.show = val;
    },
    show(val) {
      this.$emit('update:isShow', val);
    },
  },
};
</script>

<style>

</style>
