import { useNavigate } from 'react-router-dom'
import './WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="page welcome-page">
      <div className="welcome-header">
        <h1>GrowthEdit</h1>
        <p>Create stunning videos with AI</p>
      </div>
      <div className="welcome-content">
        <div className="welcome-logo">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="url(#gradient)" />
            <polygon points="40,30 40,70 70,50" fill="white" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1BDBDB" />
                <stop offset="100%" stopColor="#9968FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h2>Welcome to your creative studio</h2>
        <p className="welcome-description">
          Transform your ideas into engaging videos with the power of AI. 
          Get started by generating a new video or creating a custom template.
        </p>
        <div className="welcome-buttons">
          <button 
            className="button button-primary"
            onClick={() => navigate('/template')}
          >
            <span className="button-icon">✨</span>
            Generate Video
          </button>
          <button 
            className="button button-secondary"
            disabled
          >
            <span className="button-icon">🎨</span>
            Create a Template
            <span className="coming-soon">Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage

