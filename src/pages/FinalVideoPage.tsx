import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FinalVideoPage.css'

function FinalVideoPage() {
  const navigate = useNavigate()
  const [downloading, setDownloading] = useState(false)

  const handleDownload = () => {
    setDownloading(true)
    // Simulate download
    setTimeout(() => {
      console.log('Video downloaded!')
      setDownloading(false)
      alert('Video downloaded successfully!')
    }, 2000)
  }

  const handleCreateNew = () => {
    navigate('/')
  }

  return (
    <div className="page final-video-page">
      <div className="page-header">
        <h1>Your Video is Ready!</h1>
        <p>Download and share your creation</p>
      </div>
      <div className="page-content">
        <div className="video-player-final">
          <div className="video-placeholder-final">
            <img 
              src="https://via.placeholder.com/400x711/1BDBDB/ffffff?text=Final+Video" 
              alt="Final video" 
            />
            <div className="play-overlay">
              <div className="play-button-large">▶</div>
            </div>
            <div className="video-badge">
              <span>✨ Final Version</span>
            </div>
          </div>
        </div>

        <div className="final-video-actions">
          <div className="video-info">
            <div className="info-row">
              <span className="info-label">Duration</span>
              <span className="info-value">15 seconds</span>
            </div>
            <div className="info-row">
              <span className="info-label">Format</span>
              <span className="info-value">MP4 (1080x1920)</span>
            </div>
            <div className="info-row">
              <span className="info-label">Size</span>
              <span className="info-value">~8.5 MB</span>
            </div>
          </div>

          <button 
            className="button button-primary button-download"
            onClick={handleDownload}
            disabled={downloading}
          >
            {downloading ? (
              <>
                <span className="spinner"></span>
                Downloading...
              </>
            ) : (
              <>
                <span className="download-icon">⬇️</span>
                Download Video
              </>
            )}
          </button>

          <div className="action-buttons">
            <button 
              className="button button-secondary"
              onClick={handleCreateNew}
            >
              Create New Video
            </button>
            <button 
              className="button button-secondary"
              onClick={() => navigate('/full-video')}
            >
              Edit Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinalVideoPage

