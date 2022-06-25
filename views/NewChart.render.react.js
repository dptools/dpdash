import React from 'react'
import { createRoot } from 'react-dom/client'
import NewChart from './NewChart.react'

const container = document.getElementById('charts')
const root = createRoot(container)

root.render(<NewChart />)
