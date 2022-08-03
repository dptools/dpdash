import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import EditChart from './EditChart.react'
import store from '../stores/store'

const container = document.getElementById('charts')
const root = createRoot(container)

root.render(
  <Provider store={store()}>
    <EditChart />
  </Provider>
)
