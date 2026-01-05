import { TaskModel } from './TaskModel';

export class TaskController {
  constructor(setTasks, setIsReactive) {
    this.setTasks = setTasks; // O Controller ganha poder para mudar a tela
    this.isReactive = false;
    this.eventSource = null;
  }

  // Inicialização
  async init() {
    await this.refresh();
  }

  // Ação: Mudar modo (REST vs Reativo)
  toggleMode(active) {
    this.isReactive = active;
    
    if (this.isReactive) {
      console.log('MVC: Iniciando modo Reativo...');
      // Controller gerencia a conexão, não a View
      this.eventSource = new EventSource(TaskModel.getEventsUrl());
      
      this.eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.setTasks(data); // Controller atualiza a View
      };
    } else {
      console.log('MVC: Voltando para REST');
      if (this.eventSource) this.eventSource.close();
      this.refresh();
    }
  }

  // Ação: Adicionar
  async handleAdd(title) {
    await TaskModel.create(title);
    if (!this.isReactive) this.refresh();
  }

  // Ação: Remover
  async handleDelete(id) {
    await TaskModel.remove(id);
    if (!this.isReactive) this.refresh();
  }

  // Auxiliar para atualizar lista manual
  async refresh() {
    const tasks = await TaskModel.fetchAll();
    this.setTasks(tasks);
  }

  // Limpeza (quando fecha a tela)
  dispose() {
    if (this.eventSource) this.eventSource.close();
  }
}