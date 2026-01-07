import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import TemplatePage from './pages/TemplatePage'
import ImageSlotsPage from './pages/ImageSlotsPage'
import VideoPreviewsPage from './pages/VideoPreviewsPage'
import FullVideoPage from './pages/FullVideoPage'
import FinalVideoPage from './pages/FinalVideoPage'
import './App.css'
import './pages/responsive.css'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/template" element={<TemplatePage />} />
          <Route path="/image-slots" element={<ImageSlotsPage />} />
          <Route path="/video-previews" element={<VideoPreviewsPage />} />
          <Route path="/full-video" element={<FullVideoPage />} />
          <Route path="/final-video" element={<FinalVideoPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

