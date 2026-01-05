const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- DADOS EM MEMÓRIA ---
let tasks = [
  { id: 1, title: 'Estudar MVC' },
  { id: 2, title: 'Configurar Backend' }
];

let clients = [];

function broadcastUpdate() {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(tasks)}\n\n`);
  });
}

// --- ROTAS ---
app.get('/tasks', (req, res) => res.json(tasks));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);
  
  res.write(`data: ${JSON.stringify(tasks)}\n\n`);
  
  req.on('close', () => {
    clients = clients.filter(c => c.id !== clientId);
  });
});

app.post('/tasks', (req, res) => {
  const newTask = { id: Date.now(), title: req.body.title };
  tasks.push(newTask);
  broadcastUpdate();
  res.status(201).json(newTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== id);
  broadcastUpdate();
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});