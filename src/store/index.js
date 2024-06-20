// src/store/index.js
import { createStore } from "vuex";
import createPersistedState from "vuex-persistedstate";

export default createStore({
  state: {
    tool: "",
  },
  mutations: {
    SET_TOOL(state, tool) {
      state.tool = tool;
    },
  },
  actions: {
    setTool({ commit }, tool) {
      commit("SET_TOOL", tool);
    },
  },
  getters: {
    getTool: (state) => state.tool,
  },
  plugins: [createPersistedState()], // 使用 vuex-persistedstate 插件
});
