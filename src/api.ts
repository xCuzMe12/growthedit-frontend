// src/api.ts (or api.ts for TypeScript)

import axios from 'axios';

// Set up your base URL (replace with your backend URL)
const BASE_URL = 'http://localhost:8000';

// Create an instance of Axios with default configurations
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000000, // Set the request timeout (optional)
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











export default api;
