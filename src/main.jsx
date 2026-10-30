import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'
import App from './App.jsx'
import ProjectDetail from './components/ProjectDetail'
import BlogList from './components/BlogList'
import BlogPost from './components/BlogPost'

// Loaded only when someone opens the room, so the main site stays light
const Room = lazy(() => import('./components/room/Room'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/room" element={<Suspense fallback={null}><Room /></Suspense>} />
          </Routes>
        </LanguageProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
