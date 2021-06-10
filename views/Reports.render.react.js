import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Reports from './Reports.react'
import store from '../stores/store'

const reduxStore = store()

render(<Provider store={reduxStore}><Reports /></Provider>, document.getElementById('main'));
