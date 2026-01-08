import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './VideoPreviewsPage.css'
import { regenerateVideo } from '../api'

interface VideoPreview {
  clip_id: number
  video_s3_url: string
  regenerating: boolean
  regeneratePrompt: string
}

function VideoPreviewsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // Retrieve videos (the result data) passed from the previous page
  const [videos, setVideos] = useState<VideoPreview[]>([])

  useEffect(() => {
    // Get the result data from the location state passed from the previous page
    const result = location.state?.result || []

    // Create an array of video previews with video URLs
    const videoPreviews = result.map((item: any) => ({
      clip_id: item.clip_id,
      video_s3_url: item.video_s3_url,  // Using the actual video URL
      regenerating: false,  // To handle regenerating state
      regeneratePrompt: '',  // Prompt for regeneration
    }))

    setVideos(videoPreviews)  // Update state with video URLs
  }, [location.state])

  // Toggle regenerating state for a video
  const toggleRegenerate = (clip_id: number) => {
    setVideos(prev =>
      prev.map(video =>
        video.clip_id === clip_id
          ? { ...video, regenerating: !video.regenerating, regeneratePrompt: '' }
          : video
      )
    )
  }

  // Update the regenerate prompt for a video
  const updateRegeneratePrompt = (clip_id: number, prompt: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.clip_id === clip_id ? { ...video, regeneratePrompt: prompt } : video
      )
    )
  }

  // Handle the video regeneration process
  const handleRegenerate = async (clip_id: number) => {
    const video = videos.find((vid) => vid.clip_id === clip_id)
    if (!video || !video.regeneratePrompt) return

    const promptToUse = video.regeneratePrompt
    const previousUrl = video.video_s3_url

    try {
      console.log(`Regenerating video for clip ${clip_id} with prompt:`, promptToUse)
      console.log('PREVIOUS URL:', previousUrl)

      const result = await regenerateVideo(promptToUse)
      console.log('Result of video regeneration:', result)

      setVideos(currentVideos =>
        currentVideos.map((vid) =>
          vid.clip_id === clip_id
            ? {
                ...vid,
                video_s3_url: result.video_s3_url,
                regenerating: false,
                regeneratePrompt: '',
              }
            : vid
        )
      )
    } catch (error) {
      console.error('Error regenerating video:', error)
      setVideos(currentVideos =>
        currentVideos.map((vid) =>
          vid.clip_id === clip_id ? { ...vid, regenerating: false } : vid
        )
      )
    }
  }

  return (
    <div className="page video-previews-page">
      <div className="page-header">
        <h1>Video Previews</h1>
        <p>Select your favorite video or regenerate</p>
      </div>
      <div className="page-content">
        <div className="videos-list">
          {videos.map((video) => (
            <div key={video.clip_id} className="video-preview">
              <div className="video-container">
                <div className="video-thumbnail">
                  <video key={video.video_s3_url} width="100%" height="100%" controls>
                    <source src={video.video_s3_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <button 
                  className="regenerate-btn"
                  onClick={() => toggleRegenerate(video.clip_id)}
                >
                  🔄
                </button>
              </div>
              {video.regenerating && (
                <div className="regenerate-input">
                  <input
                    type="text"
                    className="input-field"
                    placeholder="What would you like to change?"
                    value={video.regeneratePrompt}
                    onChange={(e) => updateRegeneratePrompt(video.clip_id, e.target.value)}
                  />
                  <button
                    className="button button-primary button-small"
                    onClick={() => handleRegenerate(video.clip_id)}
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
            onClick={() => navigate('/full-video')}
          >
            Continue with Video Rendering
          </button>

          <button
            className="button button-secondary"
            // onClick={() => navigate('/image-slots')}
            onClick={() => console.log(videos)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPreviewsPage;
