import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import DeepDive from './DeepDive.react'
import store from '../stores/store'

const reduxStore = store()
const container = document.getElementById('main')
const root = createRoot(container)

root.render(<Provider store={reduxStore}><DeepDive /></Provider>)
