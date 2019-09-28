import axios from 'axios';

const OTR_TYPE_KEY = 'otrTypeDict';
const RECORD_TYPE_KEY = 'recordType';
const ACCSYS_TYPE_KEY = 'accSysType';

function parseDict(dictList, keyField, valueField) {
  return dictList.reduce((a, b, i) => {
    a[b[keyField]] = b[valueField];
    return a;
  }, {});
}

const dictState = {
  otrTypeDict: {},
  recordTypeDict: {},
  accSysType: [],
};

const dictGetters = {
  otrTypeDict: state => state.otrTypeDict,
  recordTypeDict: state => state.recordTypeDict,
  // eslint-disable-next-line max-len
  // accSysType: state => state.accSysType.map((v) => { return { accId: v.code, accName: v.msg }; }),
  // eslint-disable-next-line arrow-body-style
  accSysType: state => state.accSysType.map(v => ({ accId: v.code, accName: v.msg })),
};

/**
 * 初始化字段数据
 * @param {*} ctx Vuex容器
 * @param {String} url 请求地址
 * @param {String} key sessionStore的Key
 * @param {String} mutationName 调用mutation函数名
 * @return Promise
 */
function initDict(ctx, url, key, mutationName) {
  const dict = sessionStorage.getItem(key);
  if (dict) {
    return ctx.commit(mutationName, dict);
  }
  return axios.get(url).then(res => res.data).then(res => res.data)
    .then(data => ctx.commit(mutationName, data));
}

const dictAction = {
  initOtrType(ctx) {
    return initDict(ctx, '/dict/otrtype', OTR_TYPE_KEY, 'initOtrType');
  },
  initRecordType(ctx) {
    return initDict(ctx, '/dict/recordtype', RECORD_TYPE_KEY, 'initRecordType');
  },
  initAccSysType(ctx) {
    return initDict(ctx, '/dict/accsystype', ACCSYS_TYPE_KEY, 'initAccSysType');
  },
};

const dictMutations = {
  initOtrType(state, dict) {
    if (Array.isArray(dict)) {
      state.otrTypeDict = parseDict(dict, 'code', 'msg');
      sessionStorage.setItem(OTR_TYPE_KEY, JSON.stringify(dict));
    } else {
      state.otrTypeDict = parseDict(JSON.parse(dict), 'code', 'msg');
    }
  },
  initRecordType(state, dict) {
    if (Array.isArray(dict)) {
      state.recordTypeDict = parseDict(dict, 'code', 'msg');
      sessionStorage.setItem(RECORD_TYPE_KEY, JSON.stringify(dict));
    } else {
      state.recordTypeDict = parseDict(JSON.parse(dict), 'code', 'msg');
    }
  },
  initAccSysType(state, dict) {
    if (Array.isArray(dict)) {
      state.accSysType = dict;
      sessionStorage.setItem(ACCSYS_TYPE_KEY, JSON.stringify(dict));
    } else {
      state.accSysType = JSON.parse(dict);
    }
  },
};

export default {
  state: dictState,
  getters: dictGetters,
  mutations: dictMutations,
  actions: dictAction,
};
