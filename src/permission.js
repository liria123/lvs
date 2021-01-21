import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// const whiteList = ["/login"]; // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   // document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // 如果登录，重定向到主页
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // 获取用户信息
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // 删除令牌并转到登录页面重新登录
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

router.beforeEach((to, from, next) => {
  NProgress.start();
  // 切换路由时动态变化页面title
  // document.title = getPageTitle(to.meta.title);
  const hasToken = getToken("access_token");
  if (hasToken) {
    next()
  } else {
    next(false)
    // token不存在时，直接跳转到登录页
    window.location.href = "../index.html#/login"
  }
  NProgress.done();
});
router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
