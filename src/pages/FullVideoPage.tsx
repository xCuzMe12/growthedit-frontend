import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FullVideoPage.css';
import { renderResult, renderStatus, renderWithAudio } from '../api';

function FullVideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the workflowId from location.state
  const workflowId = location.state?.workflowId;

  const [selectedMusic, setSelectedMusic] = useState('upbeat');
  const [generateSubtitles, setGenerateSubtitles] = useState(false);
  const [previewVideoURL, setPreviewVideoURL] = useState('');
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null); // Properly typed audioPlayer


    const musicOptions = [
      { value: 'upbeat', label: '🎵 Upbeat Pop', src: '/music/upbeat.mp3' },
      { value: 'chill', label: '🎸 Chill Vibes', src: '/music/chill.mp3' },
      { value: 'corporate', label: '💼 Corporate', src: '/music/corporate.mp3' },
      { value: 'electronic', label: '🔊 Electronic', src: '/music/electronic.mp3' },
      { value: 'acoustic', label: '🎹 Intense', src: '/music/intense.mp3' },
  ];
  const handleGenerate = async () => {
    try {
      // Define the payload object
      const payload = {
        "project_id": "sample_composite_001",
        "intermediate_url": "https://t3.storage.dev/growthedit/renders/assembly_c689875b-cb5d-4f0b-9f92-44cc454d8b5d_20260108_181334.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=tid_buKCvqiHQ_uTawdhUrGHLqdqKTKpogznOyzdZOwOTsrzfzwwfm%2F20260108%2Fauto%2Fs3%2Faws4_request&X-Amz-Date=20260108T181336Z&X-Amz-Expires=604800&X-Amz-SignedHeaders=host&X-Amz-Signature=a89e1e10724d4f519df4f45cdfdda717079257cb552b216130ef40a9b626e734",
        "output_config": {
          "resolution": "1920x1080",
          "fps": 30,
          "format": "mp4",
          "bucket": "growthedit-renders",
          "key": "outputs/sample_composite_001.mp4"
        },
        "resources": {
          "audio_bg": {
            "type": "audio",
            "url": "https://growthedit.t3.storage.dev/test/upbeat.mp3"  // Updated audio URL
          }
        },
        "timeline": {
          "overlay_track": [
            {
              "type": "text",
              "content": "Sample Video",
              "start_time": 0.5,
              "end_time": 3.0,
              "style": {
                "font": "Arial",
                "size": 72,
                "color": "white",
                "x": 100,
                "y": 100
              }
            },
            {
              "type": "text",
              "content": "Final Scene",
              "start_time": 8.0,
              "end_time": 12.0,
              "style": {
                "font": "Arial",
                "size": 64,
                "color": "yellow",
                "x": 100,
                "y": 200
              }
            }
          ],
          "audio_track": [
            {
              "resource_id": "audio_bg",
              "trim_in": 60.0,
              "trim_out": null,
              "trim_to_video": true,
              "volume": 1.0,
              "fade_out": 0.0,
              "offset": 2.0
            }
          ]
        }
      };
  
      // Call the render function with the payload
      console.log(payload);
      const res = await renderWithAudio(payload);
      console.log("res", res)
      const id = res.workflow_id;
      const finalVideo = await renderResult(id);
      console.log(finalVideo); 

      // Navigate to the final video page
      //navigate('/final-video', { state: { payload, render: res } });
    }
       catch (error) {
      console.error('Error fetching render result:', error);
    }
  };
  

  // Function to check the status of the video
  const checkForVideo = async () => {
    const intervalId = setInterval(async () => {
      try {
        // Check the status of the video
        const statusRes = await renderStatus(workflowId);
        console.log('Status Response:', statusRes);

        if (statusRes.status === 'completed') {
          // If status is completed, handle the result
          clearInterval(intervalId); // Stop checking
          handleResultAndDownload();
        }
      } catch (error) {
        console.error('Error checking video status:', error);
      }
    }, 5000); // Check every 5 seconds
  };

  // Handle the result and trigger the video download
  const handleResultAndDownload = async () => {
    try {
      const res = await renderResult(workflowId);
      console.log('Render response:', res);

      const s3Url = res.s3_url;
      setPreviewVideoURL(s3Url);  // Update video URL state
    } catch (error) {
      console.error('Error fetching render result:', error);
    }
  };

  // Start checking for video when workflowId is set
  useEffect(() => {
    if (workflowId) {
      checkForVideo(); // Start checking for video
    }
  }, [workflowId]);

  // Play selected music when it changes
  useEffect(() => {
    if (audioPlayer) {
      const selectedTrack = musicOptions.find(option => option.value === selectedMusic);
      if (selectedTrack) {
        console.log(`Selected music: ${selectedTrack.label}`);
        console.log(`Setting audio player source to: ${selectedTrack.src}`);
        
        audioPlayer.src = selectedTrack.src;
        audioPlayer.type = 'audio/mp3'; // Ensure type is set
        audioPlayer.load();  // Make sure to load the new audio source
      }
    }
  }, [selectedMusic, audioPlayer]);

  // Handle Play Music button click
  const handlePlayMusic = () => {
    if (audioPlayer) {
      const selectedTrack = musicOptions.find(option => option.value === selectedMusic);
      if (selectedTrack) {
        console.log(`Playing audio: ${selectedTrack.label}`);
        audioPlayer.play()
          .then(() => {
            console.log(`Audio is playing: ${selectedTrack.label}`);
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
      }
    }
  };

  return (
    <div className="page full-video-page">
      <div className="page-header">
        <h1>Customize Your Video</h1>
        <p>Add music and subtitles</p>
      </div>
      <div className="page-content">
        <div className="video-player">
          <div className="video-placeholder">
            <div className="video-container">
              {previewVideoURL ? (
                <video className="video-player" width="100%" height="auto" controls>
                  <source src={previewVideoURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Loading video...</p>
              )}
            </div>
          </div>
        </div>

        {/* Customization options */}
        <div className="customization-section">
          <div className="form-group">
            <label className="label">🎵 Background Music</label>
            <select
              className="input-field select-field"
              value={selectedMusic}
              onChange={(e) => setSelectedMusic(e.target.value)}
            >
              {musicOptions.map((option) => (
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
            <p className="checkbox-hint">Automatically add captions to your video</p>
          </div>
        </div>

        {/* Button group */}
        <div className="button-group">
          <button className="button button-primary" onClick={handleGenerate}>
            Generate Final Video
          </button>
          <button className="button button-primary" onClick={handlePlayMusic}>
                Preview The Video  
          </button>
        </div>
      </div>

      {/* Hidden audio player */}
      <audio ref={(audio) => setAudioPlayer(audio)} />
    </div>
  );
}

export default FullVideoPage;
