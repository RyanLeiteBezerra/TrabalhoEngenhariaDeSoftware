// src/mvp/TaskPresenter.js
import { TaskModel } from './TaskModel';

export class TaskPresenter {
  // O Presenter recebe a "view" (interface para atualizar a tela)
  constructor(viewInterface) {
    this.view = viewInterface; 
    this.isReactive = false;
    this.eventSource = null;
  }

  // Inicializa a tela
  async init() {
    await this.loadTasks();
  }

  // Lógica de Negócio: Carregar dados e mandar a View exibir
  async loadTasks() {
    try {
      const tasks = await TaskModel.fetchAll();
      this.view.showTasks(tasks); // O Presenter ORDENA a view a mostrar
    } catch (error) {
      console.error("Erro ao carregar", error);
    }
  }

  // Evento: Usuário digitou e clicou em Adicionar
  async onAddTask(title) {
    await TaskModel.create(title);
    if (!this.isReactive) this.loadTasks();
  }

  // Evento: Usuário clicou em Excluir
  async onRemoveTask(id) {
    await TaskModel.remove(id);
    if (!this.isReactive) this.loadTasks();
  }

  // Evento: Usuário trocou o switch REST/Reativo
  toggleMode(isActive) {
    this.isReactive = isActive;
    
    if (this.isReactive) {
      // Inicia conexão SSE
      this.eventSource = new EventSource(TaskModel.getEventsUrl());
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.view.showTasks(data); // Atualiza View automaticamente
      };
    } else {
      // Fecha conexão e volta ao manual
      if (this.eventSource) this.eventSource.close();
      this.loadTasks();
    }
  }
}