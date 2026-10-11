import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import reportWebVitals from './reportWebVitals'
import { postOpen } from '@sawt/game'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
)
root.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

// one anonymous "the app was opened" to sada — module scope, not a React
// effect, so StrictMode's second mount can never count a visit twice
postOpen('color')
