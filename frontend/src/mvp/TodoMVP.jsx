// src/mvp/TodoMVP.jsx
import React, { useState, useEffect, useRef } from 'react';
import { TaskPresenter } from './TaskPresenter';

export default function TodoMVP() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isReactive, setIsReactive] = useState(false);

  // Truque para manter o Presenter vivo entre renderizações
  const presenterRef = useRef(null);

  // Inicialização Única
  if (!presenterRef.current) {
    // Definimos o "Contrato" que a View oferece ao Presenter
    const viewInterface = {
      showTasks: (data) => setTasks(data),
      // Poderíamos ter outros métodos aqui, ex: showLoading(), showError()
    };
    presenterRef.current = new TaskPresenter(viewInterface);
  }

  const presenter = presenterRef.current;

  useEffect(() => {
    presenter.init();
    // Cleanup ao desmontar o componente
    return () => presenter.toggleMode(false); 
  }, []);

  // Eventos de UI (User Interface)
  const handleAddClick = () => {
    presenter.onAddTask(newTask);
    setNewTask('');
  };

  const handleRemoveClick = (id) => {
    presenter.onRemoveTask(id);
  };

  const handleModeChange = (e) => {
    const checked = e.target.checked;
    setIsReactive(checked);
    presenter.toggleMode(checked);
  };

  return (
    <div style={{ padding: '20px', border: '1px solid green', maxWidth: '400px' }}>
      <h2 style={{color: 'green'}}>Arquitetura MVP</h2>
      
      <div style={{ marginBottom: '10px', background: '#e0ffe0', padding: '10px' }}>
        <label>
          <input type="checkbox" checked={isReactive} onChange={handleModeChange} />
          {' '}Modo Reativo (Presenter Atualiza)
        </label>
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Tarefa MVP..."
        />
        <button onClick={handleAddClick}>Adicionar</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            {task.title}
            <button onClick={() => handleRemoveClick(task.id)} style={{ color: 'red' }}>X</button>
          </li>
        ))}
      </ul>

      {!isReactive && (
        <button onClick={() => presenter.loadTasks()} style={{marginTop: '10px', width: '100%'}}>
          Atualizar (Via Presenter)
        </button>
      )}
    </div>
  );
}