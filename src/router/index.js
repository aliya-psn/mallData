/**
 * 前端路由 vue-router
 * 通过这个文件，用来定义路由的跳转
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    children: [{
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },
  {
    path: '/collection',
    component: Layout,
    children: [{
      path: 'collection',
      name: 'collection',
      component: () => import('@/views/collection/index'),
      meta: { title: '数据采集', icon: 'collection' }
    }]
  },
  {
    path: '/comparison',
    component: Layout,
    children: [{
      path: 'comparison',
      name: 'comparison',
      component: () => import('@/views/comparison/index'),
      meta: { title: '价格对比', icon: 'echart' }
    }]
  },
  {
    path: '/mine',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Mine',
      component: () => import('@/views/mine/index'),
      meta: { title: '个人中心', icon: 'user' }
    }]
  },
  // {
  //   path: '/echart',
  //   component: Layout,
  //   children: [{
  //     path: 'echart',
  //     name: 'Echart',
  //     component: () => import('@/views/echarts/index'),
  //     meta: { title: '统计图表', icon: 'echart' }
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
