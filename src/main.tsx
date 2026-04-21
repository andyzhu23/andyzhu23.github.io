import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

// Only play the intro animation when the user lands directly on home.
// On any other route, mark the intro as done synchronously so the background,
// navbar, and particles render at full opacity on first paint (no 7s transition delay).
if (window.location.pathname === '/' || window.location.pathname === '') {
  document.body.classList.remove('intro-done')
} else {
  document.body.classList.add('intro-done')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
