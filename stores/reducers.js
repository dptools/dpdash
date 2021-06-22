import { combineReducers } from 'redux';
import { isBrowser } from '../server/utils/browserUtil';

function subject(state = isBrowser() ? window.SUBJECT : null) {
  return state
}

function graph(state = isBrowser() ? window.GRAPH : null) {
  return state
}

function user(state = isBrowser() ? window.USER : null) {
  return state
}

function report(state = isBrowser() ? window.REPORT : null) {
  if (window.REPORT === undefined) return null;
  return state;
}

const rootReducer = combineReducers({
  graph,
  user,
  subject,
  report
})

export default rootReducer
