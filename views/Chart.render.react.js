import React from 'react'
import { createRoot } from 'react-dom/client'
import Chart from './Chart.react'

const container = document.getElementById('charts')
const root = createRoot(container)

root.render(<Chart />)
