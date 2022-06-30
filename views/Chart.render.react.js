import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import Chart from './Chart.react'
import store from '../stores/store'

const reduxStore = store()
const container = document.getElementById('charts')
const root = createRoot(container)

root.render(<Provider store={reduxStore}><Chart /></Provider>)
