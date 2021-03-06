import axios from 'axios'
import NProgress from 'nprogress'

export function request(config) {
  //创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })

  // axios拦截器
  // 请求拦截
  instance.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
  }), err => {

  }
  // 响应拦截
  instance.interceptors.response.use(res => {
    NProgress.done()
    return res.data
  }), err => {

  }

  return instance(config)
}
