import { login, logout, register } from '@/api/user'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    name: '',
    avatar: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user register
  registerAction({ commit }, userInfo) {
    const { username, password, logo } = userInfo
    return new Promise((resolve, reject) => {
      register({
        userName: username.trim(),
        password: password,
        logo: logo
      }).then(response => {
        if (response.code === '000') {
          resolve()
        } else {
          reject(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user login
  loginAction({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), passWord: password }).then(response => {
        if (response.code === '000') {
          commit('SET_NAME', username)
          resolve()
        } else {
          reject(response.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem('loginStatus')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

