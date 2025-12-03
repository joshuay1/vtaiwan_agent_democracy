import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Debates from './pages/Debates.jsx'
import ChatPage from './pages/ChatPage.jsx'
import DebatePage from './pages/DebatePage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ReferendumPage from './pages/ReferendumPage.jsx'
import Layout from './components/Layout.jsx'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'

const isProd = import.meta.env.MODE === 'production'
const Router = isProd ? HashRouter : BrowserRouter

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route element={<Layout /> }>
          <Route path="/" element={<Navigate to="/about" replace />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/debate" element={<DebatePage />} />
          <Route path="/past" element={<Debates />} />
          <Route path="/referendum" element={<ReferendumPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Route>
      </Routes>
    </Router>
  </StrictMode>,
)
