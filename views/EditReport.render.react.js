import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import EditReport from './EditReport.react'
import store from '../stores/store'

const reduxStore = store()

render(<Provider store={reduxStore}><EditReport /></Provider>, document.getElementById('main'));
