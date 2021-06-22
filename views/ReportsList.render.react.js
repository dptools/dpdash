import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import ReportsList from './ReportsList.react'
import store from '../stores/store'

const reduxStore = store()

render(<Provider store={reduxStore}><ReportsList /></Provider>, document.getElementById('main'));
