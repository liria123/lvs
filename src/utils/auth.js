import Cookies from 'js-cookie'

const TokenKey = 'TokenKey'

export function getToken(TokenKey) {
  // return Cookies.get(TokenKey)
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  // let currentCookieSetting = {
  //   expires: 1
  // }
  // return Cookies.set(TokenKey, token , currentCookieSetting)
  return localStorage.setItem(TokenKey, token)
}

export function removeToken(TokenKey) {
  // return Cookies.remove(TokenKey)
  return localStorage.removeItem(TokenKey)
}
