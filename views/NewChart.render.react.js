import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import NewChart from './NewChart.react'
import store from '../stores/store'

const container = document.getElementById('charts')
const root = createRoot(container)

root.render(<Provider store={store()}><NewChart /></Provider>)
