import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ImageSlotsPage.css'

interface ImageSlot {
  id: number
  url: string
  regenerating: boolean
  regeneratePrompt: string
}

function ImageSlotsPage() {
  const navigate = useNavigate()
  const [images, setImages] = useState<ImageSlot[]>([
    { id: 1, url: 'https://via.placeholder.com/300x400/667eea/ffffff?text=Frame+1', regenerating: false, regeneratePrompt: '' },
    { id: 2, url: 'https://via.placeholder.com/300x400/764ba2/ffffff?text=Frame+2', regenerating: false, regeneratePrompt: '' },
    { id: 3, url: 'https://via.placeholder.com/300x400/f093fb/ffffff?text=Frame+3', regenerating: false, regeneratePrompt: '' },
    { id: 4, url: 'https://via.placeholder.com/300x400/4facfe/ffffff?text=Frame+4', regenerating: false, regeneratePrompt: '' },
    { id: 5, url: 'https://via.placeholder.com/300x400/00f2fe/ffffff?text=Frame+5', regenerating: false, regeneratePrompt: '' },
    { id: 6, url: 'https://via.placeholder.com/300x400/43e97b/ffffff?text=Frame+6', regenerating: false, regeneratePrompt: '' },
  ])

  const toggleRegenerate = (id: number) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, regenerating: !img.regenerating, regeneratePrompt: '' } : img
    ))
  }

  const updateRegeneratePrompt = (id: number, prompt: string) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, regeneratePrompt: prompt } : img
    ))
  }

  const handleRegenerate = (id: number) => {
    console.log(`Regenerating image ${id} with prompt:`, images.find(img => img.id === id)?.regeneratePrompt)
    toggleRegenerate(id)
  }

  return (
    <div className="page image-slots-page">
      <div className="page-header">
        <h1>Generated Images</h1>
        <p>Review and regenerate frames as needed</p>
      </div>
      <div className="page-content">
        <div className="images-grid">
          {images.map((image) => (
            <div key={image.id} className="image-slot">
              <div className="image-container">
                <img src={image.url} alt={`Frame ${image.id}`} />
                <button 
                  className="regenerate-btn"
                  onClick={() => toggleRegenerate(image.id)}
                  title="Regenerate"
                >
                  🔄
                </button>
              </div>
              {image.regenerating && (
                <div className="regenerate-input">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="What would you like to change?"
                    value={image.regeneratePrompt}
                    onChange={(e) => updateRegeneratePrompt(image.id, e.target.value)}
                  />
                  <button 
                    className="button button-primary button-small"
                    onClick={() => handleRegenerate(image.id)}
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="button-group">
          <button 
            className="button button-primary"
            onClick={() => navigate('/video-previews')}
          >
            Generate Videos
          </button>

          <button 
            className="button button-secondary"
            onClick={() => navigate('/template')}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageSlotsPage

