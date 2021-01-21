import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  // {
  //   path: '/login',
  //   component: () => import('@/views/login/index'),
  //   hidden: true
  // },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [{
      path: 'index',
      name: 'Index',
      component: () => import('@/views/index/index'),
      meta: { title: 'Index', icon: 'index' }
    },
    {
      path: '/working-group/high-availability',
      name: 'HighAvailability',
      component: () => import('@/views/high-availability/index'),
      meta: { title: 'high-availability', icon: 'index' }
    },
    {
      path: '/working-group/high-availability-vrrp_instance',
      name: 'HighAvailabilityVrrpinstances',
      component: () => import('@/views/high-availability-vrrp_instance/index'),
      meta: { title: 'high-availability-vrrp_instance', icon: 'index' }
    },
    {
      path: '/working-group/load-balancing',
      name: 'LoadBalancing',
      component: () => import('@/views/load-balancing/index'),
      meta: { title: 'load-balancing', icon: 'index' }
    },
    {
      path: '/working-group/task-list',
      name: 'TaskList',
      component: () => import('@/views/task-list/index'),
      meta: { title: 'task-list', icon: 'index' }
    }]
  },

  // {
  //   path: '/working-group',
  //   component: Layout,
  //   children: [{
  //     path: '/working-group/high-availability',
  //     name: 'HighAvailability',
  //     component: () => import('@/views/high-availability/index'),
  //     meta: { title: 'high-availability', icon: 'index' }
  //   }]
  // },
  // {
  //   path: '/working-group',
  //   component: Layout,
  //   children: [{
  //     path: '/working-group/high-availability-vrrp_instance',
  //     name: 'HighAvailabilityVrrpinstances',
  //     component: () => import('@/views/high-availability-vrrp_instance/index'),
  //     meta: { title: 'high-availability-vrrp_instance', icon: 'index' }
  //   }]
  // },

  // {
  //   path: '/working-group',
  //   component: Layout,
  //   children: [{
  //     path: '/working-group/load-balancing',
  //     name: 'LoadBalancing',
  //     component: () => import('@/views/load-balancing/index'),
  //     meta: { title: 'load-balancing', icon: 'index' }
  //   }]
  // },
  // {
  //   path: '/working-group',
  //   component: Layout,
  //   children: [{
  //     path: '/working-group/task-list',
  //     name: 'TaskList',
  //     component: () => import('@/views/task-list/index'),
  //     meta: { title: 'task-list', icon: 'index' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
