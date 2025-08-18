import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import { HomePage } from './pages/Home'

import './index.css'
import { HomePage } from './pages/Home'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <TestPage/> */}
    <HomePage/>
  </StrictMode>,
)
