import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import applyContent from './data/applyContent.js'
import './index.css'

async function boot() {
  try {
    const r = await fetch('/api/content')
    if (r.ok) applyContent(await r.json())
  } catch (e) {
    // server not running: default content is used
  }
  const { default: App } = await import('./App.jsx')
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </React.StrictMode>
  )
}
boot()