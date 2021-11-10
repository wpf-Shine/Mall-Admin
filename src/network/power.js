import { request } from './request'

// 权限列表
export function getRights(type) {
  return request({
    url: 'rights/' + type,
    method: 'get'
  })
}

// 角色列表
export function getRoles() {
  return request({
    url: 'roles',
    method: 'get'
  })
}

// 添加角色
export function addRoles(data) {
  return request({
    url: 'roles',
    method: 'post',
    data
  })
}
// 获取角色信息
export function getRole(id) {
  return request({
    url: 'roles/' + id,
    method: 'get'
  })
}

//编辑角色
export function editRole(id, data) {
  return request({
    url: 'roles/' + id,
    method: 'put',
    data
  })
}

// 删除角色
export function delRole(id) {
  return request({
    url: 'roles/' + id,
    method: 'delete'
  })
}

// 删除权限
export function delRight(roleId, rightId) {
  return request({
    url: `roles/${roleId}/rights/${rightId}`,
    method: 'delete'
  })
}

// 添加权限
export function addRight(roleId, data) {
  return request({
    url: 'roles/' + roleId + '/rights',
    method: 'post',
    data
  })
}