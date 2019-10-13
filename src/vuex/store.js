import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const state = {
  MainJudge: true,
  EditJudge: false,
  AddJudge: false,
  loginLevel: 'superRoot',
  automaticGrabState: false,
  searchState: false
}
const mutations = {
  FixEditJudge (state) {
    state.EditJudge = !state.EditJudge
  },
  FixAddJudge (state) {
    state.AddJudge = !state.AddJudge
  },
  FixMainJudge (state) {
    state.MainJudge = !state.MainJudge
  },
  InitializationMainJudge (state) {
    state.MainJudge = true
  },
  InitializationEditJudge (state) {
    state.EditJudge = false
  },
  InitializationAddJudge (state) {
    state.AddJudge = false
  },
  InitializationLoginLevel (state, loginLevel) {
    state.loginLevel = loginLevel
  },
  InitializationAutomaticGrabState (state, nowState) {
    state.automaticGrabState = nowState
  },
  ResetSearchState (state) {
    state.searchState = false
  },
  OpenSearchState (state) {
    state.searchState = true
  }
}

export default new Vuex.Store({
  state,
  mutations
})
