<template>
  <div class="flow-container">
    <div class="header">
      <div class="top">
        <i class="iconfont">&#xe604;</i>
        <h1 class="title">记一笔</h1>
        <span class="submit-btn">保存</span>
      </div>
      <ul class="nav-list">
        <router-link
          tag="li"
          class="hover"
          :to="`/flows/${code}`"
          v-for="(label, code) of recordTypeDict"
          :key="code"
        >
          {{label}}
        </router-link>
      </ul>
    </div>
    <div class="flow-form">
      <div class="amount-box">
        <input class="amount" v-model="amount" />
      </div>
      <transition-group name="list" tag="div">
        <div class="form-item" v-for="(item, key) of formItems" :key="key">
          <label><i :class="['iconfont', key]" v-html="item.iconText"></i>{{item.name}}</label>
          <div class="input-box">
            <component :is="item.pickerType"
              :columns="item.columns"
              :is-show.sync="item.isShow"
              :key-field="item.keyField"
              :label-field="item.labelField"
              :default-current="item.defaultCurrent"
              @column-change="item.columnChange"
            >
              <template scope="{ currents }">{{ item.viewShow(currents) }}</template>
            </component>
          </div>
          <i class="iconfont close"
            v-show="item.isClosable"
            @click="() => item.onremove(key)">&#xe60a;</i>
        </div>
      </transition-group>
    </div>
    <div class="tab-box">
      <div class="tab-item"
        v-for="(tabItem, index) in tabItems"
        :key="tabItem.id"
        @click="() => tabChange(tabItem, index)"
      > {{tabItem.name}} </div>
    </div>
    <div class="bottom">
      <div class="btn submit-btn" @click="onsave">保存</div>
      <div class="btn">存为模板</div>
      <div class="btn">再记一笔</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Picker from '@/components/Picker/MultiPicker';
import DateTimePicker from '@/components/Picker/DateTimePicker';
import ArrayUtils from '@/assets/utils/ArrayUtils';
import ObjectUtils from '@/assets/utils/ObjectUtils';

export default {
  components: {
    Picker,
    DateTimePicker,
  },
  data() {
    return {
      type: '',
      amount: '0.00',
      formItems: {
        cate: {
          id: '1000',
          iconText: '&#xe600;',
          name: '分类',
          pickerType: 'picker',
          columns: [[], []],
          isShow: false,
          isClosable: false,
          defaultCurrent: [],
          keyField: 'cateId',
          labelField: 'cateName',
          viewShow: currents => (currents[0] && currents[1] ? `${currents[0].cateName} - ${currents[1].cateName}` : ''),
          columnChange: this.cateColumnChange,
          onClose: () => {},
        },
        account: {
          id: '2000',
          iconText: '&#xe600;',
          name: '账户',
          pickerType: 'picker',
          columns: [[], []],
          isShow: false,
          isClosable: false,
          defaultCurrent: [],
          keyField: 'accId',
          labelField: 'accName',
          viewShow: currents => (currents[1] ? currents[1].accName : ''),
          columnChange: this.accColumnChange,
          onClose: () => {},
        },
      },
      tabItems: [
        {
          id: '3000',
          key: 'time',
          name: '时间',
        },
        {
          id: '0001',
          key: 'shopper',
          name: '商家',
        },
        {
          id: '0002',
          key: 'member',
          name: '成员',
        },
        {
          id: '0003',
          key: 'project',
          name: '项目',
        },
      ],
    };
  },
  async mounted() {
    this.type = this.$route.params.id;
    await this.initRecordType();
    this.type = this.type || Object.keys(this.recordTypeDict)[0];
    await this.initCateList(this.type);
    this.initCateSelection();
    await this.initAccSysType();
    await this.initAccList(this.accSysType[0].accId);
    this.initAccSelection();
  },
  methods: {
    ...mapActions(['initRecordType', 'initAccSysType', 'initCateList', 'initAccList', 'initOtr']),
    /**
     * 初始化分类列表数据
     */
    initCateSelection() {
      const firstCate = this.getCateByPid(0);
      const nextCate = this.getCateByPid(firstCate[0].cateId);
      this.formItems.cate.columns = [firstCate, nextCate];
      this.formItems.cate.defaultCurrent = [firstCate[0].cateId, nextCate[0].cateId];
    },
    /**
     * 监听分类数据滚动变化
     */
    cateColumnChange(currents, index) {
      if (index === 0) {
        const nextCate = this.getCateByPid(currents[index].cateId);
        this.$set(this.formItems.cate.columns, 1, nextCate);
      }
      this.formItems.cate.defaultCurrent = currents.map(v => v.cateId);
    },
    /**
     * 初始化账户数据
     */
    initAccSelection() {
      const firstType = this.accSysType;
      const nextAcc = this.accList;
      this.formItems.account.columns = [firstType, nextAcc];
      this.formItems.account.defaultCurrent = [firstType[0].accId, nextAcc[0].accId];
    },
    /**
     * 监听账户数据变化
     */
    async accColumnChange(currents, index) {
      if (index === 0) {
        await this.initAccList(currents[index].accId);
        const nextAcc = this.accList;
        this.$set(this.formItems.account.columns, 1, nextAcc);
      }
      this.formItems.account.defaultCurrent = currents.map(v => v.accId);
    },
    tabChange(item, index) {
      this.tabItems.splice(index, 1);
      const onClose = () => this.tabItems.push(item);
      switch (item.key) {
        case 'time': this.pushTime(item, onClose); break;
        default: this.pushOther(item, onClose); break;
      }
    },
    pushTime(item, onClose) {
      const time = {
        id: item.id,
        iconText: '&#xe751;',
        name: '时间',
        pickerType: 'date-time-picker',
        isShow: false,
        isClosable: true,
        columnChange: d => d,
        viewShow: currents => (currents[2] ? `${currents[0].label} ${currents[1].label} ${currents[2].label}` : ''),
        onremove: (key) => {
          this.$delete(this.formItems, key);
          onClose();
        },
      };
      this.formItems[item.key] = time;
    },
    pushOther(item, onClose) {
      const otrItem = {
        id: item.id,
        iconText: '&#xe603;',
        name: item.name,
        pickerType: 'picker',
        isShow: false,
        isClosable: true,
        columns: [[]],
        defaultCurrent: [],
        keyField: 'otrId',
        labelField: 'otrName',
        columnChange: () => {},
        viewShow: () => {},
        onremove: (key) => { this.$delete(this.formItems, key); onClose(); },
      };
      this.formItems[item.key] = otrItem;
    },
    /**
    onpopup(key) {
      const keys = Object.keys(this.formItems).filter(k => k !== key);
      keys.forEach(k => this.$set(this.formItems[k], 'isShow', false));
      this.$forceUpdate();
    },
     */
    onsave() {
      console.log(this.form);
    },
  },
  computed: {
    ...mapGetters(['recordTypeDict', 'cateList', 'getCateByPid', 'accList', 'accSysType', 'projectList']),
    form() {
      return ObjectUtils.filterNull({
        flowAmount: this.amount,
        srcAccId: ArrayUtils.get(this.formItems.account.defaultCurrent, 1),
        cateId1: this.formItems.cate && ArrayUtils.get(this.formItems.cate.defaultCurrent, 0),
        cateId2: this.formItems.cate && ArrayUtils.get(this.formItems.cate.defaultCurrent, 1),
        otrId1: this.formItems.project && ArrayUtils.get(this.formItems.project.defaultCurrent, 0),
        otrId2: this.formItems.member && ArrayUtils.get(this.formItems.member.defaultCurrent, 0),
        otrId3: this.formItems.shopper && ArrayUtils.get(this.formItems.shopper.defaultCurrent, 0),
        flowRecordType: this.type,
      });
    },
  },
  beforeRouteUpdate(to, from, next) {
    this.type = to.params.id;
    next();
  },
  watch: {

  },
};
</script>

<style lang="scss">

$headerPadding: 0.2rem;
$hoverColor: #fd8201;
$arrowSize: 6px;
$incomeColor: #f84f38;
$cateIconColor: #ce7998;
$accountColor: #cecb6b;
$memberColor: #efb198;
$shopperColor: #c48e9d;
$projectColor: #56cba5;
$remarkColor: #8079ac;

@keyframes list-enter {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

.header {
  padding-top: $headerPadding;
  .top {
    position: relative;
    padding-bottom: $headerPadding;
    .iconfont {
      position: absolute;
      left: 0.2rem;
    }
    .title {
      text-align: center;
      font-weight: 600;
    }
    .submit-btn {
      position: absolute;
      top: 0;
      right: 0.2rem;
      color: $hoverColor;
    }
  }
  .nav-list {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    li {
      position: relative;
      padding: $headerPadding 0;
      flex: 1;
      text-align: center;
      color: #666;
      &.hover {
        color: $hoverColor;
        &::after {
          display: block;
          position: absolute;
          content: '';
          bottom: 0;
          left: 50%;
          margin-left: - $arrowSize;
          border: $arrowSize solid transparent;
          border-bottom: $arrowSize solid $hoverColor;
        }
      }
    }
  }
}
.flow-form {
  padding: 0 0.16rem;
  .amount-box {
    padding: 0.48rem 0;
    border-bottom: 1px solid $incomeColor;
    .amount {
      display: block;
      font-size: 48px;
      font-weight: 600;
      line-height: 1;
      color: $incomeColor;
    }
  }
  .list-enter-active {
    animation: list-enter .5s;
  }
  .list-leave-active {
    animation: list-enter .5s reverse;
  }
  .form-item {
    display: flex;
    margin-top: .16rem;
    height: 0.96rem;
    line-height: 0.96rem;
    flex-direction: row;
    label {
      display: block;
      width: 1.28rem;
      text-align: center;
      color: #666;
      .iconfont {
        margin: 0 0.1rem;
        &.cate {
          color: $cateIconColor;
        }
        &.account {
          color: $accountColor;
        }
        &.member {
          color: $memberColor;
        }
        &.shopper {
          color: $shopperColor;
        }
        &.project {
          color: $projectColor;
        }
        &.remark {
          color: $remarkColor;
        }
      }
    }
    .close {
      float: right;
      margin-right: 0.16rem;
      color: #999;
    }
    .input-box {
      flex: 1;
      padding-left: 0.16rem;
      .input {
        height: 100%;
        text-align: left;
      }
    }
  }
}
.tab-box {
  padding: .32rem 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  .tab-item {
    padding: .16rem .24rem;
    color: #fff;
    background-color: #939393;
    border-radius: 32px;
  }
}

.bottom {
  display: flex;
  margin: 0.6rem 0;
  flex-direction: row;
  align-content: space-around;
  .btn {
    flex-basis: 1.6rem;
    margin: 0 0.36rem;
    border-radius: 2px;
    padding: 0.16rem 0;
    color: #666;
    background-color: #ebebeb;
    text-align: center;
  }
  .submit-btn {
    flex-basis: 2rem;
    color: #fff;
    background-color: $hoverColor;
  }
}
</style>
