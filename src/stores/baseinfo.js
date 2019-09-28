import axios from 'axios';

const OTR_TYPE_DICT = {
  '0001': 'projectList',
  '0002': 'shopperList',
  '0003': 'memberList',
};

export default {
  state: {
    cateList: [],
    accList: [],
    projectList: [],
  },
  getters: {
    cateList: state => state.cateList,
    getCateByPid: state => pid => state.cateList.filter(v => v.parentId === pid),
    accList: state => state.accList,
    projectList: state => state.projectList,
  },
  actions: {
    initCateList(ctx, cateType) {
      const cateList = sessionStorage.getItem(`cateList:${cateType}`);
      if (cateList) {
        return ctx.commit('initCateList', { cateList, cateType });
      }
      return axios.get(`/cate/list?cateType=${cateType}`)
        .then(res => res.data).then(res => res.data)
        .then(data => ctx.commit('initCateList', { cateList: data, cateType }));
    },
    initAccList(ctx, accSysType) {
      const accList = sessionStorage.getItem(`accList:${accSysType}`);
      if (accList) {
        return ctx.commit('initAccList', { accList, accSysType });
      }
      return axios.get(`/account/list?accSysType=${accSysType}`)
        .then(res => res.data).then(res => res.data)
        .then(data => ctx.commit('initAccList', { accList: data, accSysType }));
    },
    initOtr(ctx, otrType) {
      const otrList = sessionStorage.getItem(`otrList:${otrType}`);
      if (otrList) {
        return ctx.commit('initOtr', { otrList, otrType });
      }
      return axios.get(`/other/list?orderBy=0000&otrType=${otrType}`)
        .then(res => res.data).then(res => res.data)
        .then(data => ctx.commit('initOtr', { otrList: data, otrType }));
    },
  },
  mutations: {
    initCateList(state, data) {
      if (Array.isArray(data.cateList)) {
        state.cateList = data.cateList;
        sessionStorage.setItem(`cateList:${data.cateType}`, JSON.stringify(data.cateList));
      } else {
        state.cateList = JSON.parse(data.cateList);
      }
    },
    initAccList(state, { accList, accSysType }) {
      if (Array.isArray(accList)) {
        state.accList = accList;
        sessionStorage.setItem(`accList:${accSysType}`, JSON.stringify(accList));
      } else {
        state.accList = JSON.parse(accList);
      }
    },
    initOtr(state, { otrList, otrType }) {
      if (Array.isArray(otrList)) {
        state[OTR_TYPE_DICT[otrType]] = otrList;
        sessionStorage.setItem(`otrList:${otrType}`, JSON.stringify(otrList));
      } else {
        state[OTR_TYPE_DICT[otrType]] = JSON.parse(otrList);
      }
    },
  },
};
