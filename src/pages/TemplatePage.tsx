import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitPrompt } from '../api'; // Import the API function
import './TemplatePage.css';

function TemplatePage() {
  const navigate = useNavigate();
  const [template, setTemplate] = useState('add');
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // Track loading state

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (prompt || image) {
      try {
        setLoading(true); // Show loading state
        const result = await submitPrompt(prompt);
        console.log('Response from API:', result);

        // Pass result as state to the next page
        navigate('/image-slots', { state: { result } });
      } catch (error) {
        console.error('Error during submission:', error);
      } finally {
        setLoading(false); // Hide loading state after response
      }
    }
  };

  return (
    <div className="page template-page">
      {loading ? (
        <div className="loading-screen">
          <h1>While you wait, go gamble a bit, on Bitstarz</h1>
          <a href="https://www.bitstarz.com/" target="_blank" rel="noopener noreferrer">
            <img src="https://www.bitstarz.com/favicon.ico" alt="BitStarz Logo" className="bitstarz-logo" />
          </a>
        </div>
      ) : (
        <>
          <div className="page-header">
            <h1>Create Your Video</h1>
            <p>Choose a template and describe your vision</p>
          </div>
          <div className="page-content">
            <div className="form-section">
              <div className="form-group">
                <label className="label">Select Template</label>
                <select
                  className="input-field select-field"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                >
                  <option value="add">Ad Template</option>
                  <option value="flashlight_POV">Flashlight POV Template</option>
                </select>
              </div>

              <div className="form-group">
                <label className="label">AI Prompt</label>
                <textarea
                  className="input-field"
                  placeholder="Describe what you want to create... e.g., 'Make an ad for this shoe I'm selling'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
            </div>

            {template === 'add' && (
              <div className="form-group">
                <label className="label">Reference Image (Optional)</label>
                <div className="upload-area">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="file-input"
                  />
                  <label htmlFor="image-upload" className="upload-label">
                    {imagePreview ? (
                      <div className="image-preview">
                        <img src={imagePreview} alt="Preview" />
                        <div className="image-overlay">
                          <span>Change Image</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="upload-icon">📷</div>
                        <div>Upload an image</div>
                        <div className="upload-hint">PNG, JPG up to 10MB</div>
                      </>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="button-group">
              <button
                className="button button-primary"
                onClick={handleSubmit}
                disabled={!prompt && !image}
              >
                Generate Images
              </button>

              <button
                className="button button-secondary"
                onClick={() => navigate('/')}
              >
                Back
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default TemplatePage;
