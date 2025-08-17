import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { HomePage } from './pages/Home'

import './index.css'
import { TestPage } from './pages/Test'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestPage/>
  </StrictMode>,
)
