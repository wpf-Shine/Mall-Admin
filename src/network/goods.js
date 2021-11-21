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

export function addCate(data) {
  return request({
    url: 'categories',
    method: 'post',
    data
  })
}

export function delCate(id) {
  return request({
    url: 'categories/' + id,
    method: 'delete'
  })
}

export function editCate(id, data) {
  return request({
    url: 'categories/' + id,
    method: 'put',
    data
  })
}