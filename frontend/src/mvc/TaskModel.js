import axios from 'axios';

const API_URL = 'http://localhost:3001/tasks';
const EVENTS_URL = 'http://localhost:3001/events';

export const TaskModel = {
  // Busca dados via REST
  async fetchAll() {
    const response = await axios.get(API_URL);
    return response.data;
  },

  // Cria tarefa
  async create(title) {
    if (!title) return;
    await axios.post(API_URL, { title });
  },

  // Deleta tarefa
  async remove(id) {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Retorna a URL para conexão Reativa (O Model fornece a fonte do dado)
  getEventsUrl() {
    return EVENTS_URL;
  }
};