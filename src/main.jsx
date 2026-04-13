import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'
import ProjectDetail from './components/ProjectDetail'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
