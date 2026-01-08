import { useState, useEffect, Fragment } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './VideoPreviewsPage.css'
import { regenerateVideo, renderVideo } from '../api'

interface VideoPreview {
  clip_id: number
  video_s3_url: string
  regenerating: boolean
  regeneratePrompt: string
}

type TransitionType = 'fade' // easy to extend later

function VideoPreviewsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [videos, setVideos] = useState<VideoPreview[]>([])

  const [transition1, setTransition1] = useState<TransitionType>('fade')
  const [transition2, setTransition2] = useState<TransitionType>('fade')

  useEffect(() => {
    const result = location.state?.result || []
    const videoPreviews = result.map((item: any) => ({
      clip_id: item.clip_id,
      video_s3_url: item.video_s3_url,
      regenerating: false,
      regeneratePrompt: '',
    }))
    setVideos(videoPreviews)
  }, [location.state])

  const toggleRegenerate = (clip_id: number) => {
    setVideos(prev =>
      prev.map(video =>
        video.clip_id === clip_id
          ? { ...video, regenerating: !video.regenerating, regeneratePrompt: '' }
          : video
      )
    )
  }

  const updateRegeneratePrompt = (clip_id: number, prompt: string) => {
    setVideos(prev =>
      prev.map(video =>
        video.clip_id === clip_id ? { ...video, regeneratePrompt: prompt } : video
      )
    )
  }

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

  const handleContinue = async () => {
    if (videos.length !== 3) {
      console.error('Expected exactly 3 videos, got:', videos.length)
      return
    }
  
    const project_id = location.state?.project_id || 'sample_assembly_three_clips_001'
  
    const payload = {
      project_id,
      output_config: {
        resolution: '1920x1080',
        fps: 30,
        format: 'mp4',
        bucket: 'growthedit-renders',
        key: `outputs/${project_id}.mp4`,
      },
      resources: {
        vid_01: { type: 'video', url: videos[0].video_s3_url },
        vid_02: { type: 'video', url: videos[1].video_s3_url },
        vid_03: { type: 'video', url: videos[2].video_s3_url },
      },
      timeline: {
        video_track: [
          {
            resource_id: 'vid_01',
            trim_in: 0.0,
            trim_out: 4.0,
            transition: {
              type: transition1,
              duration: 1.0,
            },
          },
          {
            resource_id: 'vid_02',
            trim_in: 0.0,
            trim_out: 4.0,
            transition: {
              type: transition2,
              duration: 1.5,
            },
          },
          {
            resource_id: 'vid_03',
            trim_in: 0.0,
            trim_out: 10.0,
            transition: null,
          },
        ],
      },
    }
  
    console.log('ASSEMBLY PAYLOAD:', payload)
  
    try {
      console.log('Sending render request...')
      const res = await renderVideo(payload);
      console.log('Render response:', res)
  
      // If the render request succeeds, navigate to the next page
      navigate('/full-video', { state: { payload, render: res, workflowId: res.workflow_id } });
    } catch (e) {
      console.error('Error sending render request:', e)
      // Optional: Show a user-friendly error message here
      alert("Something went wrong with the video rendering request. Please try again later.");
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
          {videos.map((video, idx) => (
            <Fragment key={video.clip_id}>
              <div className="video-preview">
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

              {/* Transition Buttons - placed between videos */}
              {idx < videos.length - 1 && (
                <div className="transition-item">
                  <button 
                    className="button button-secondary transition-btn" 
                    onClick={() => {
                      if (idx === 0) setTransition1('fade')
                      if (idx === 1) setTransition2('fade')
                        console.log('Transition:', idx + 1, transition1, transition2)
                    }}
                  >
                    Transition {idx + 1}: <strong>{idx === 0 ? transition1 : transition2}</strong>
                  </button>
                </div>
              )}
            </Fragment>
          ))}
        </div>

        <div className="button-group">
          <button className="button button-primary" onClick={handleContinue}>
            Continue with Video Rendering
          </button>

          <button
            className="button button-secondary"
            onClick={() => console.log(videos)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default VideoPreviewsPage
