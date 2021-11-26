import { request } from './request'

// 商品分类
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

// 分类参数
export function getParams(id, sel) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'get',
    params: {
      sel
    }
  })
}

export function addParams(id, data) {
  return request({
    url: 'categories/' + id + '/attributes',
    method: 'post',
    data
  })
}

export function getParamById(catId, attrId, attr_sel) {
  return request({
    url: `categories/${catId}/attributes/${attrId}`,
    method: 'get',
    params: {
      attr_sel
    }
  })
}

export function editParams(id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}

export function delParams(id, attrId) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'delete'
  })
}

export function upParams(id, attrId, data) {
  return request({
    url: `categories/${id}/attributes/${attrId}`,
    method: 'put',
    data
  })
}

// 商品列表
export function getGoodsList(query, pagenum, pagesize) {
  return request({
    url: 'goods',
    method: 'get',
    params: {
      query, pagenum, pagesize
    }
  })
}

export function delGood(id) {
  return request({
    url: 'goods/' + id,
    method: 'delete'
  })
}