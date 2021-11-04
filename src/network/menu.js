import { request } from "./request";

export function getMenuList(menu) {
  return request({
    url: '/menus',
    parmas: {
      menu
    }
  })
}