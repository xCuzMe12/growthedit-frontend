// src/api.ts (or api.ts for TypeScript)

import axios from 'axios';

// Set up your base URL (replace with your backend URL)
const BASE_URL = 'http://localhost:8000';

// Create an instance of Axios with default configurations
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000000000, // Set the request timeout (optional)
});


//REQUESTI
//1. POŠILJANJE PROMPTA NA BACKEND
export const submitPrompt = async (prompt: string) => {
  try {
    const response = await api.post('/workflow', { prompt });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting prompt:', error);
    throw error;
  }


};

export const regenerateImage = async (prompt: string, clip_id: number) => {
  try {
    const response = await api.post('/regenerate', { "prompt": prompt, "clip_id": clip_id });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting prompt:', error);
    throw error;
  }

};

export const generateVideos = async (images: any[]) => {
  try {
    // Prepare the images data by cleaning up the data
    const payload = images.map((item: any) => ({
      id: item.id,  // Include the required id field
      clip_id: item.clip_id,
      start_frame_s3_url: item.start_frame_s3_url,
      end_frame_s3_url: item.end_frame_s3_url,
      video_prompt: item.video_prompt
    }));

    const response = await api.post('/generate-videos', { items: payload });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video generation:', error);
    throw error;
  }
};

export const regenerateVideo = async (prompt: string) => {
  try {

    const response = await api.post('/regenerate-video', { "prompt": prompt });
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video regeneration:', error);
    throw error;
  }
};


export const renderVideo = async (payload: any) => {
  try {

    const response = await api.post('/render/assembly', payload);
    console.log('Render response:', response.data);
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video regeneration:', error);
    throw error;
  }
};


export const renderStatus = async (workflow_id: string) => {
  try {

    const response = await api.get(`/render/${workflow_id}`);
    console.log('Render response:', response.data);
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video regeneration:', error);
    throw error;
  }
};

export const renderResult = async (workflow_id: string) => {
  try {

    const response = await api.get(`/render/${workflow_id}/result`);
    console.log('Render response:', response.data);
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video regeneration:', error);
    throw error;
  }
};

export const renderWithAudio = async (payload: any) => {
  try {

    const response = await api.post('/render/composite', payload);
    console.log('Render response:', response.data);
    return response.data;  // Handle the response as needed
  } catch (error) {
    console.error('Error submitting video regeneration:', error);
    throw error;
  }
};




export default api;
