import React, { useState, useEffect, useRef } from 'react';
import { TaskController } from './TaskController';

export default function TodoMVC() {
  // Estado Local (A View precisa disso para renderizar)
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isReactive, setIsReactive] = useState(false);

  // Instanciamos o Controller usando useRef para ele persistir entre renders
  // Passamos o 'setTasks' para ele poder mandar na gente
  const controllerRef = useRef(new TaskController(setTasks, setIsReactive));
  const controller = controllerRef.current;

  // Ciclo de Vida
  useEffect(() => {
    controller.init();
    return () => controller.dispose(); // Limpeza
  }, []);

  // Handlers da View (apenas repassam para o Controller)
  const onAddClick = () => {
    controller.handleAdd(newTask);
    setNewTask(''); // Limpar input é responsabilidade da UI
  };

  const onDeleteClick = (id) => {
    controller.handleDelete(id);
  };

  const onModeChange = (e) => {
    const checked = e.target.checked;
    setIsReactive(checked);
    controller.toggleMode(checked);
  };

  const onRefreshClick = () => {
    controller.refresh();
  };

  // --- RENDERIZAÇÃO (HTML) ---
  return (
    <div style={{ padding: '20px', border: '1px solid blue', maxWidth: '400px' }}>
      <h2 style={{color: 'blue'}}>Arquitetura MVC</h2>
      
      <div style={{ marginBottom: '10px', background: '#e0e0ff', padding: '10px' }}>
        <label>
          <input type="checkbox" checked={isReactive} onChange={onModeChange} />
          {' '}Modo Reativo (Controller Gerencia)
        </label>
      </div>

      <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
        <input 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          placeholder="Tarefa MVC..."
        />
        <button onClick={onAddClick}>Adicionar</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
            {task.title}
            <button onClick={() => onDeleteClick(task.id)} style={{ color: 'red' }}>X</button>
          </li>
        ))}
      </ul>
      
      {!isReactive && <button onClick={onRefreshClick} style={{marginTop: '10px', width: '100%'}}>Atualizar (Via Controller)</button>}
    </div>
  );
}