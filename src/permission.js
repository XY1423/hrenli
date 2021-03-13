// 权限拦截 导航守卫 路由守卫  router
import router from '@/router' // 引入路由实例
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式

// 定义一份路由白名单，里面是不被权限管束额页面路径
const whiteList = ['/login','/404']
 router.beforeEach ( async function(to,from,next) {
  NProgress.start() //进度条插件
  // 首先先判断当前有没有token
  if(store.getters.token){
    // 如果有token 继续判断是不是跳转去/login
    if(to.path === '/login') {
      // 如果是的话直接放行
      next()
    }else {
      // 否则接着判断当前有没有userid 
      if(!store.getters.userId) {
        // 没有的话就调用方法获取
      const {roles} =  await store.dispatch('user/getUserInfo')

        // 筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // routes就是筛选得到的动态路由
        // 动态路由 添加到 路由表中 默认的路由表 只有静态路由 没有动态路由
        // addRoutes  必须 用 next(地址) 不能用next()
        router.addRoutes([...routes,{ path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表  铺路
        // 添加完动态路由之后
        next(to.path) // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走，掉坑里，多做一次跳转，再从门外往里进一次，跳转之前 把路铺好，再次进来的时候，路就铺好了
      }else {
        next()
      }
    }
  }else {
    // 否则继续判断它在没在白名单中
    if(whiteList.indexOf(to.path)>-1){
      // 如果在的话直接放行
      next()
    }else {
      // 否则让用户去登入页面
      next('/login')
    }
  }
  NProgress.done()
})

router.afterEach(function() {
  NProgress.done()
})