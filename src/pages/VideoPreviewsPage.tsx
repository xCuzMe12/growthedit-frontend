import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './VideoPreviewsPage.css'

interface VideoPreview {
  id: number
  thumbnail: string
  regenerating: boolean
  regeneratePrompt: string
}

function VideoPreviewsPage() {
  const navigate = useNavigate()
  const [videos, setVideos] = useState<VideoPreview[]>([
    { 
      id: 1, 
      thumbnail: 'https://via.placeholder.com/300x533/667eea/ffffff?text=Video+1', 
      regenerating: false, 
      regeneratePrompt: '' 
    },
    { 
      id: 2, 
      thumbnail: 'https://via.placeholder.com/300x533/764ba2/ffffff?text=Video+2', 
      regenerating: false, 
      regeneratePrompt: '' 
    },
    { 
      id: 3, 
      thumbnail: 'https://via.placeholder.com/300x533/f093fb/ffffff?text=Video+3', 
      regenerating: false, 
      regeneratePrompt: '' 
    },
  ])

  const toggleRegenerate = (id: number) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, regenerating: !video.regenerating, regeneratePrompt: '' } : video
    ))
  }

  const updateRegeneratePrompt = (id: number, prompt: string) => {
    setVideos(videos.map(video => 
      video.id === id ? { ...video, regeneratePrompt: prompt } : video
    ))
  }

  const handleRegenerate = (id: number) => {
    console.log(`Regenerating video ${id} with prompt:`, videos.find(v => v.id === id)?.regeneratePrompt)
    toggleRegenerate(id)
  }

  return (
    <div className="page video-previews-page">
      <div className="page-header">
        <h1>Video Previews</h1>
        <p>Select your favorite or regenerate</p>
      </div>
      <div className="page-content">
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.id} className="video-preview">
              <div className="video-container">
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={`Video ${video.id}`} />
                  <div className="play-overlay">
                    <div className="play-button">▶</div>
                  </div>
                </div>
                <button 
                  className="regenerate-btn"
                  onClick={() => toggleRegenerate(video.id)}
                  title="Regenerate"
                >
                  🔄
                </button>
              </div>
              {video.regenerating && (
                <div className="regenerate-input">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="What changes would you like?"
                    value={video.regeneratePrompt}
                    onChange={(e) => updateRegeneratePrompt(video.id, e.target.value)}
                  />
                  <button 
                    className="button button-primary button-small"
                    onClick={() => handleRegenerate(video.id)}
                  >
                    Regenerate
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="button-group">
          <button 
            className="button button-primary"
            onClick={() => navigate('/full-video')}
          >
            Continue with Video 1
          </button>

          <button 
            className="button button-secondary"
            onClick={() => navigate('/image-slots')}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPreviewsPage

