import Cookies from 'js-cookie'

const TokenKey = 'my_super_token'
const keyTime = 'super_key_timeout'
// 获取token
export function getToken() {
  return Cookies.get(TokenKey)
}
// 设置token
export function setToken(token) {
  return Cookies.set(TokenKey, token)
}
// 删除Cookies 中的token
export function removeToken() {
  return Cookies.remove(TokenKey)
}

// 获得时间戳
export function getTimeStamp() {
  return  Cookies.get(keyTime)
}
// 设置时间戳
export function setTimeStamp() {
  Cookies.set(keyTime,Date.now())
}