import TodoMVC from "./mvc/TodoMVC";
import TodoMVP from "./mvp/TodoMVP";
import TodoMVVM from "./mvvm/TodoMVVM";

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{textAlign: 'center'}}>Comparativo de Arquiteturas</h1>
      <p style={{textAlign: 'center'}}> Backend hospedado no Render.com | Frontend Vite na porta 5173</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        
        {/* Coluna 1: MVC (Azul) */}
        <div>
          <TodoMVC />
        </div>

        {/* Coluna 2: MVP (Verde) */}
        <div>
          <TodoMVP />
        </div>

        {/* Coluna 3: MVVM (Padrão/Cinza) */}
        <div>
          <TodoMVVM />
        </div>

      </div>
    </div>
  );
}

export default App;