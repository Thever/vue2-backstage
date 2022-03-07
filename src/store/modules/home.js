/* eslint-disable */
import mockRequest from "@/utils/mockRequest";
import data from "/mock/data.json";
const state = {
  list: {},
};
const mutations = {
  GETDATA(state, list) {
    state.list = list;
  },
};
const actions = {
  //发请求获取首页的mock数据
  async getData({ commit }) {
    // let result = await mockRequest.get("/home/list");
    // if (result.code == 20000) {
    //   commit("GETDATA", result.data);
    // }
    //  直接写死返回
    commit("GETDATA", data);
  },
};
const getters = {};
export default {
  state,
  mutations,
  actions,
  getters,
};
