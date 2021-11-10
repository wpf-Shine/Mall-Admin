import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('@/views/Login/Login')
const Home = () => import('@/views/Home/Home')
const Welcome = () => import('@/views/Welcome/Welcome')
const Users = () => import('@/views/Users/Users')
const Rights = () => import('@/views/Power/Rights')
const Roles = () => import('@/views/Power/Roles')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: Users
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/roles',
          component: Roles
        }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  // next()放行    next('/login') 强制跳转
  if (to.path == '/login') return next()
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next();
})

export default router