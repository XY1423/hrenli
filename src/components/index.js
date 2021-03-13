// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from "./PageTools/index.vue";
import ScreenFull from "./ScreenFull";
import ThemePicker from "./ThemePicker";
export default {
  install(Vue) {
    //  注册全局的通用栏组件对象
    Vue.component("PageTools", PageTools);

    Vue.component("ScreenFull", ScreenFull); // 注册全屏组件
    Vue.component("ThemePicker", ThemePicker);
  }
};
