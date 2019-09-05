import { combineReducers } from 'redux'

import {
	CONFIGURE_DASHBOARD
} from './actions'

function subject(state = window.SUBJECT, action) {
	return state
}

function graph(state = window.GRAPH, action) {
	return state
}

function user(state = window.USER, action) {
//	switch(action.type) {
//		case CONFIGURE_DASHBOARD:
//			return Object.assign({}, state, {
//				dashboard.configuration: action.configuration
//			})
//		default:
//	}
	return state
}

const rootReducer = combineReducers({
	graph,
	user,
	subject
})

export default rootReducer
