import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)

  const isLogin = localStorage.getItem('loginStatus')
  // 如果用户未登录但已经在登录页，直接放行
  if (to.path === '/login') {
    next()
    NProgress.done()
  } else if (isLogin) {
    // 已登录用户直接放行
    next()
  } else {
    // 未登录用户重定向到登录页
    next('/login')
    NProgress.done()
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
