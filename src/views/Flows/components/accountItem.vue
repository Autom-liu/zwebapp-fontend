<template>
  <div class="form-item">
    <label><i class="iconfont cate">&#xe600;</i>账户</label>
    <div class="input-box" @click="onpupup">
      <picker
        :columns="accountColumns"
        :is-show="isShow"
        :key-field="keyField"
        :label-field="labelField"
        :default-current="defaultCurrent"
        @column-change="accountColumnChange"
        @withdraw="withdraw"
        v-slot=" {currents} "
      >
        {{ viewShow(currents) }}
      </picker>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Picker from '@/components/Picker/MultiPicker';

export default {
  props: {
    selectedAccount: {
      type: Object,
      required: true,
    },
  },
  components: {
    Picker,
  },
  data() {
    return {
      accountColumns: [[], []],
      isShow: false,
      defaultCurrent: [0, 0],
      keyField: 'accId',
      labelField: 'accName',
    };
  },
  created() {
    this.initAccSysType();
    this.initAccList(this.accSysType[0].accId);
    this.initAccSelection();
  },
  methods: {
    ...mapActions(['initAccSysType', 'initAccList']),
    onpupup() {
      this.isShow = true;
    },
    viewShow(currents) {
      return currents[1] ? currents[1].accName : '';
    },
    /**
     * 初始化账户数据
     */
    initAccSelection() {
      const firstType = this.accSysType;
      const nextAcc = this.accList;
      this.accountColumns = [firstType, nextAcc];
      this.defaultCurrent = [firstType[0].accId, nextAcc[0].accId];
    },
    /**
     * 监听账户数据变化
     */
    accountColumnChange(currents, index) {
      if (index === 0) {
        this.initAccList(currents[index].accId);
        const nextAcc = this.accList;
        this.$set(this.accountColumns, 1, nextAcc);
      }
      this.defaultCurrent = currents.map(v => v.accId);
    },
    withdraw(current) {
      this.isShow = false;
      this.$emit('update:selectedAccount', current[1]);
    },
  },
  computed: {
    ...mapGetters(['accList', 'accSysType']),
  },
}
</script>

<style>

</style>