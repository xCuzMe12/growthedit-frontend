import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ImageSlotsPage.css';
import { regenerateImage, generateVideos } from '../api';

interface ImageSlot {
  id: number;
  url: string;
  regenerating: boolean;
  regeneratePrompt: string;
  isStartFrame: boolean; // Flag to distinguish between start and end frames
}

interface ImageItem {
  start_frame_s3_url: string;
  end_frame_s3_url: string;
}

function ImageSlotsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve images and result from the previous page's state
  const [images, setImages] = useState<ImageSlot[]>([]);
  const result = location.state?.result || []; // Get result from location state
  var result_temp = location.state?.result || [];;

  useEffect(() => {
    // Create an array of images: first 3 start frames, then 3 end frames
    const generatedImages = [
      // Top 3 start frames (first frames)
      ...result.map((item: ImageItem, index: number) => ({
        id: index + 1,
        url: item.start_frame_s3_url,
        regenerating: false,
        regeneratePrompt: '',
        isStartFrame: true,
      })),
      // Bottom 3 end frames (last frames)
      ...result.map((item: ImageItem, index: number) => ({
        id: index + 4,
        url: item.end_frame_s3_url,
        regenerating: false,
        regeneratePrompt: '',
        isStartFrame: false,
      })),
    ];
    setImages(generatedImages); // Update state with the generated images
  }, [result]);

  // Toggle the regenerating state of an image
  const toggleRegenerate = (id: number) => {
    setImages(images.map((img) =>
      img.id === id ? { ...img, regenerating: !img.regenerating, regeneratePrompt: '' } : img
    ));
  };

  // Update the regeneration prompt for a specific image
  const updateRegeneratePrompt = (id: number, prompt: string) => {
    setImages(images.map((img) =>
      img.id === id ? { ...img, regeneratePrompt: prompt } : img
    ));
  };

  // Handle the regeneration process when the user clicks "Apply"
  const handleRegenerate = async (id: number) => {
    const image = images.find((img) => img.id === id);
    if (image && image.regeneratePrompt) {
      try {
        console.log(`Regenerating image ${id} with prompt:`, image.regeneratePrompt);

        // Call your backend to regenerate the image and get the new URL
        const newImageData = await regenerateImage(image.regeneratePrompt, id);
        console.log('New image data received:', newImageData);

        // Replace the old image URL with the new one
        setImages(images.map((img) =>
          img.id === id ? { ...img, url: newImageData.s3_url, regenerating: false, regeneratePrompt: '' } : img
        ));
      } catch (error) {
        console.error('Error regenerating image:', error);
      }
    }
  };

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
            onClick={async () => {
              try {
                // Iterate through the result_temp and delete unnecessary fields
                const sanitizedResult = result_temp.map((item: any) => ({
                  id: item.id,  // Ensure `id` is present (it can be omitted if not needed)
                  clip_id: item.clip_id,
                  start_frame_s3_url: item.start_frame_s3_url,
                  end_frame_s3_url: item.end_frame_s3_url,
                  video_prompt: item.video_prompt,
                }));

                console.log('Sanitized result for video generation:', sanitizedResult);

                // Now call the API with the sanitized result
                const result = await generateVideos(sanitizedResult);

                console.log('Result of video generation:', result);
                navigate('/video-previews', { state: { result } }); // Pass the result to the next page

              } catch (error) {
                console.error('Error during video generation:', error);
              }

            }}
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
  );
}

export default ImageSlotsPage;
