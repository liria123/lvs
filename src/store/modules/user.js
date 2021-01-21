import { logout, login } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import util from '@/utils/rsa-pkcs1'

const state = {
  token: getToken(),
  name: 'admin',
  avatar: ''
} 
 
const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }, 
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      // login({
      //   account: userInfo.username,
      //   password: util.getRSAPassword(userInfo.password)
      // }).then(res => {
      //   commit('SET_TOKEN', res.token)
      //   setToken(res.token)
      //   localStorage.setItem('UserName', userInfo.username)
      //   resolve() 
      // }).catch(err => {
      //   reject(err)
      // })
      commit('SET_TOKEN', 'token')
      setToken('token')
      localStorage.setItem('UserName', 'test')
      resolve()
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const data = {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'admin'
      }
      const { name, avatar } = data

      commit('SET_NAME', name)
      commit('SET_AVATAR', avatar)
      resolve(data)
      // getInfo(state.token).then(response => {
      //   const { data } = response

      //   if (!data) {
      //     reject('Verification failed, please Login again.')
      //   }

      //   const { name, avatar } = data

      //   commit('SET_NAME', name)
      //   commit('SET_AVATAR', avatar)
      //   resolve(data)
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        // resolve()
      // }).catch(error => {
        // reject(error)
      // })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

