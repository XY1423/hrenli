/* eslint-disable */

import { getUserInfo, login, getUserDetailById, logout } from "@/api/user";
import { getToken, setToken, removeToken, setTimeStamp } from "@/utils/auth";
import {resetRouter} from '@/router/index'
const state = {
  // 状态
  // 初始化的时候从缓存中读取状态 并赋值到初始化的状态上
  // Vuex的持久化 如何实现 ？ Vuex和前端缓存相结合
  token: getToken(), // 设置token初始状态   token持久化 => 放到缓存中
  userInfo: {} //这里userinfo设置为一个对象而不是null是因为要在getters中引用，如果初值为null可能会报错
};
const mutations = {
  // 修改token
  setToken(state, token) {
    state.token = token; // 设置token  只是修改state的token数据
    // vuex变化 同步到 缓存数据
    setToken(token); // vuex和 缓存数据的同步
  },
  // 删除缓存的token
  removeToken(state, token) {
    state.token = null; // 删除vuex的token
    removeToken(); // 先清除 vuex  再清除缓存 vuex和 缓存数据的同步
  },
  // 设置用户信息
  setUserInfo(state, userInfo) {
    state.userInfo = { ...userInfo }; // 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  reomveUserInfo(state) {
    state.userInfo = {};
  }
};
const actions = {
  // 登录的action
  async login(context, data) {
    const result = await login(data); // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data
    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit("setToken", result);
    // 写入时间戳
    setTimeStamp(); // 将当前的最新时间写入缓存
  },
  // 获取用户资料的action
  async getUserInfo(context) {
    // 首先调用获取userinfo的方法，获得userid
    const result = await getUserInfo();
    //  然后因为这里头像和用户名并不是同一个API，所以要在调用另一个接口
    const baseinfo = await getUserDetailById(result.userId);
    //  通过解购合并两个函数得到的数据
    const baseResult = { ...result, ...baseinfo };
    //  提交到mutilation中的方法
    context.commit("setUserInfo", baseResult);
    //  这里return一下得到的参数
    return baseResult;
  },
  // 登出的action
  logout(context) {
    //  调用删除token的方法
    context.commit("removeToken");
    // 调用删除用户信息的方法
    context.commit("reomveUserInfo");
    // 重置路由
    resetRouter();
    // 还有一步  vuex中的数据是不是还在
    // 要清空permission模块下的state数据
    // vuex中 user子模块  permission子模块
    // 子模块调用子模块的action  默认情况下 子模块的context是子模块的
    // 父模块 调用 子模块的action
    context.commit("permission/setRoutes", [], { root: true });
    // 子模块调用子模块的action 可以 将 commit的第三个参数 设置成  { root: true } 就表示当前的context不是子模块了 而是父模块
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
