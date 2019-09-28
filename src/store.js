import Vue from 'vue';
import Vuex from 'vuex';
import dict from './stores/dict';
import baseinfo from './stores/baseinfo';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    dict,
    baseinfo,
  },
});
