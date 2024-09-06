const BASE_URL = 'https://backend-rs-1c3t.onrender.com';

export const apiRequest = async (endpoint: string, options: RequestInit) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};
