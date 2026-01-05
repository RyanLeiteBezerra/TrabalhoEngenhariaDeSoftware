// src/mvvm/TodoMVVM.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/tasks';
const EVENTS_URL = 'http://localhost:3001/events';

export default function TodoMVVM() {
  // --- VIEWMODEL (Estado + Lógica) ---
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isReactive, setIsReactive] = useState(false); // Switch REST vs Reativo

  // Carregar dados (Lógica Híbrida)
  useEffect(() => {
    // Se estiver no modo REATIVO: conecta no Server-Sent Events
    if (isReactive) {
      console.log('Conectando ao modo Reativo...');
      const eventSource = new EventSource(EVENTS_URL);

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setTasks(data); // Atualiza a tela sozinho!
      };

      return () => {
        eventSource.close(); // Fecha conexão ao sair ou trocar de modo
      };
    } 
    // Se estiver no modo REST: faz apenas um GET inicial
    else {
      fetchTasks();
    }
  }, [isReactive]);

  // Função auxiliar para o modo REST
  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  // Ação: Adicionar
  const handleAdd = async () => {
    if (!newTask) return;
    await axios.post(API_URL, { title: newTask });
    setNewTask('');
    // Se for REST, precisa recarregar manualmente a lista
    if (!isReactive) fetchTasks();
  };

  // Ação: Deletar
  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    // Se for REST, precisa recarregar manualmente a lista
    if (!isReactive) fetchTasks();
  };

  // --- VIEW (Interface) ---
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', maxWidth: '400px' }}>
      <h2>Arquitetura MVVM</h2>
      
      {/* Switch de Modo */}
      <div style={{ marginBottom: '10px', background: '#f0f0f0', padding: '10px' }}>
        <label>
          <input 
            type="checkbox" 
            checked={isReactive} 
            onChange={(e) => setIsReactive(e.target.checked)} 
          />
          {' '}Modo Reativo (Auto-update)
        </label>
      </div>

      {/* Inputs */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Nova tarefa..."
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>

      {/* Lista */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            {task.title}
            <button onClick={() => handleDelete(task.id)} style={{ color: 'red' }}>X</button>
          </li>
        ))}
      </ul>
      
      {!isReactive && <button onClick={fetchTasks} style={{marginTop: '10px', width: '100%'}}>Atualizar Lista (REST Manual)</button>}
    </div>
  );
}