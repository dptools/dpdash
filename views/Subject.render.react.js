import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import Subject from './Subject.react'
import store from '../stores/store'

const reduxStore = store()
const container = document.getElementById('graph')
const root = createRoot(container)

root.render(<Provider store={reduxStore}><Subject /></Provider>)
