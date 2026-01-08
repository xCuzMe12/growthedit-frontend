import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './FullVideoPage.css';
import { renderResult, renderStatus } from '../api';

function FullVideoPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the workflowId from location.state
  const workflowId = location.state?.workflowId;

  const [selectedMusic, setSelectedMusic] = useState('upbeat');
  const [generateSubtitles, setGenerateSubtitles] = useState(false);
  const [previewVideoURL, setPreviewVideoURL] = useState('');

  const musicOptions = [
    { value: 'upbeat', label: '🎵 Upbeat Pop' },
    { value: 'chill', label: '🎸 Chill Vibes' },
    { value: 'corporate', label: '💼 Corporate' },
    { value: 'electronic', label: '🔊 Electronic' },
    { value: 'acoustic', label: '🎹 Acoustic' },
    { value: 'none', label: '🔇 No Music' },
  ];

  const handleGenerate = () => {
    console.log('Generating with:', { selectedMusic, generateSubtitles });
    navigate('/final-video');
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

      if (s3Url) {
        // Open the URL in a new tab to trigger the download
        const newTab = window.open(s3Url, '_blank');
        newTab.document.location = s3Url;
      } else {
        console.error('No valid s3_url available for download');
      }
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

        </div>
      </div>
    </div>
  );
}

export default FullVideoPage;
