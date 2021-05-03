import { combineReducers } from 'redux'

function subject(state = window.SUBJECT, action) {
  return state
}

function graph(state = window.GRAPH, action) {
  return state
}

function user(state = window.USER, action) {
  return state
}

const rootReducer = combineReducers({
  graph,
  user,
  subject
})

export default rootReducer
