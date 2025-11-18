import api from './api'

/**
 * Generation API Service
 * Handles all API calls related to virtual try-on generation
 */

const generationApi = {
  /**
   * Upload an image (model or garment)
   * @param {File} file - The image file to upload
   * @param {string} imageType - Either 'model_image' or 'garment_image'
   * @returns {Promise} - Response with uploaded image data
   */
  uploadImage: async (file, imageType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('image_type', imageType)

    const response = await api.post('/generation/images/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  /**
   * Create a new generation job
   * @param {Object} data - Generation configuration
   * @param {string} data.model_image_id - UUID of uploaded model image
   * @param {string} data.garment_image_id - UUID of uploaded garment image
   * @param {string} data.provider - 'gemini' or 'replicate'
   * @param {string} data.quality_preset - 'draft', 'standard', or 'high'
   * @param {string} data.name - Optional name for the generation
   * @returns {Promise} - Response with generation data
   */
  createGeneration: async (data) => {
    const response = await api.post('/generation/generations/', data)
    return response.data
  },

  /**
   * Get a specific generation by ID
   * @param {string} id - Generation UUID
   * @returns {Promise} - Generation data with status and result
   */
  getGeneration: async (id) => {
    const response = await api.get(`/generation/generations/${id}/`)
    return response.data
  },

  /**
   * List all generations with optional filters and sorting
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (pending, processing, completed, failed)
   * @param {string} params.sort_by - Sort by field (name, -name, created_at, -created_at)
   * @returns {Promise} - Array of generations
   */
  listGenerations: async (params = {}) => {
    const response = await api.get('/generation/generations/', { params })
    return response.data
  },
}

export default generationApi
