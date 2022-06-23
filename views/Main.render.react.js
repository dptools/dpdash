import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import MainPage from './Main.react'
import store from '../stores/store'

const container = document.getElementById('main')
const root = createRoot(container)
const reduxStore = store()

root.render(<Provider store={reduxStore}><MainPage /></Provider>)
