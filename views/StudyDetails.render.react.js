import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import StudyDetails from './StudyDetails.react'
import store from '../stores/store'

const container = document.getElementById('study_details')
const root = createRoot(container)

root.render(<Provider store={store()}><StudyDetails /></Provider>)
