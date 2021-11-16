import { request } from './request'

export function getCategories(query, pagenum, pagesize) {
  return request({
    url: '/categories',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}