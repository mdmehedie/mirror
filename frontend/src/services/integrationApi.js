import api from './api'

const integrationApi = {
  listKeys: async () => (await api.get('/auth/api-keys/')).data,
  createKey: async (name) => (await api.post('/auth/api-keys/', { name })).data,
  revokeKey: async (id) => api.delete(`/auth/api-keys/${id}/`),
}

export default integrationApi
