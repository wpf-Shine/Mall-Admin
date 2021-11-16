import { request } from "./request";

export function getUserList(query, pagenum, pagesize) {
  return request({
    url: '/users',
    method: 'get',
    params: {
      query,
      pagenum,
      pagesize
    }
  })
}

// 改变用户状态
export function getUserState(uid, type) {
  return request({
    url: `users/${uid} /state/${type}`,
    method: 'put',
  })
}

// 添加用户
export function addUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUser(id) {
  return request({
    url: 'users/' + id,
    method: 'get',
  })
}
// 更新用户信息
export function editUser(id, data) {
  return request({
    url: 'users/' + id,
    method: 'put',
    data
  })
}

export function delUser(id) {
  return request({
    url: 'users/' + id,
    method: 'delete'
  })
}


// 分配角色
export function setRole(id, data) {
  return request({
    url: `users/${id}/role`,
    method: 'put',
    data
  })
}
