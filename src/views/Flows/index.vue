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
        <cate-item :type="type" key="1000" :selected-cate.sync="formItems.selectedCate" />
        <account-item key="2000" :selected-account.sync="formItems.selectedAccount" />
        <time-item key="3000" v-if="timeItemShow" @onremove="onremove('time')"
          :selectedDate.sync="formItems.selectedDate" />
        <div class="form-item" key="7000">
          <label><i class="iconfont cate">&#xe600;</i>备注</label>
          <div class="input-box"><input v-model="formItems.flowRemark" /> </div>
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
import axios from 'axios';
import CateItem from './components/cateItem';
import AccountItem from './components/accountItem';
import TimeItem from './components/timeItem';
import ObjectUtils from '@/assets/utils/ObjectUtils';

export default {
  components: {
    CateItem,
    AccountItem,
    TimeItem,
  },
  data() {
    return {
      type: '',
      amount: '0.00',
      activeItem: '',
      timeItemShow: false,
      formItems: {
        selectedAccount: {},
        selectedCate: [],
        flowRemark: '',
        selectedDate: new Date(),
      },
      constTabItems: [
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
  created() {
    this.type = this.$route.params.id;
    this.initRecordType();
    this.type = this.type || Object.keys(this.recordTypeDict)[0];
  },
  methods: {
    ...mapActions(['initRecordType']),
    tabChange(item, index) {
      this.tabItems.splice(index, 1);
      switch (item.key) {
        case 'time': this.timeItemShow = true; break;
        default: break;
      }
    },
    onremove(key) {
      switch (key) {
        case 'time':
          this.tabItems.splice(0, 0, this.constTabItems[0]);
          this.timeItemShow = false;
          this.formItems.selectedDate = null;
          break;
        default: break;
      }
    },
    onsave() {
      console.log(this.formItems);
      console.log(this.form);
      axios.post('/zwebapp-flow/flow/add', this.form);
    },
  },
  computed: {
    ...mapGetters(['recordTypeDict']),
    form() {
      return ObjectUtils.filterNull({
        flowAmount: this.amount,
        srcAccId: this.formItems.selectedAccount.accId,
        cateId1: this.formItems.selectedCate[0] && this.formItems.selectedCate[0].cateId,
        cateId2: this.formItems.selectedCate[1] && this.formItems.selectedCate[1].cateId,
        flowRemark: this.formItems.flowRemark,
        createTime: this.formItems.selectedDate,
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
