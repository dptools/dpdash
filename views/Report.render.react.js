import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import Report from './Report.react'
import store from '../stores/store'

const reduxStore = store()

render(<Provider store={reduxStore}><Report /></Provider>, document.getElementById('main'));
