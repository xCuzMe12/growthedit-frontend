import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './FullVideoPage.css'

function FullVideoPage() {
  const navigate = useNavigate()
  const [selectedMusic, setSelectedMusic] = useState('upbeat')
  const [generateSubtitles, setGenerateSubtitles] = useState(false)

  const musicOptions = [
    { value: 'upbeat', label: '🎵 Upbeat Pop' },
    { value: 'chill', label: '🎸 Chill Vibes' },
    { value: 'corporate', label: '💼 Corporate' },
    { value: 'electronic', label: '🔊 Electronic' },
    { value: 'acoustic', label: '🎹 Acoustic' },
    { value: 'none', label: '🔇 No Music' },
  ]

  const handleGenerate = () => {
    console.log('Generating with:', { selectedMusic, generateSubtitles })
    navigate('/final-video')
  }

  return (
    <div className="page full-video-page">
      <div className="page-header">
        <h1>Customize Your Video</h1>
        <p>Add music and subtitles</p>
      </div>
      <div className="page-content">
        <div className="video-player">
          <div className="video-placeholder">
            <img 
              src="https://via.placeholder.com/400x711/667eea/ffffff?text=Your+Video" 
              alt="Video preview" 
            />
            <div className="play-overlay">
              <div className="play-button">▶</div>
            </div>
          </div>
        </div>

        <div className="customization-section">
          <div className="form-group">
            <label className="label">
              🎵 Background Music
            </label>
            <select 
              className="input-field select-field"
              value={selectedMusic}
              onChange={(e) => setSelectedMusic(e.target.value)}
            >
              {musicOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={generateSubtitles}
                onChange={(e) => setGenerateSubtitles(e.target.checked)}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Generate Subtitles</span>
            </label>
            <p className="checkbox-hint">
              Automatically add captions to your video
            </p>
          </div>
        </div>

          <div className="button-group">
            <button 
              className="button button-primary"
              onClick={handleGenerate}
            >
              Generate Final Video
            </button>

            <button 
              className="button button-secondary"
              onClick={() => navigate('/video-previews')}
            >
              Back
            </button>
          </div>
      </div>
    </div>
  )
}

export default FullVideoPage

