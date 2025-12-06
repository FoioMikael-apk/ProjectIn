import React, { useState } from 'react';
import Extrato from './components/Extrato';
import FormularioTransferencia from './components/FormularioTransferencia';
import './App.css'; // Importando o CSS que acabamos de criar

function App() {
  // Estado para forçar a atualização do extrato após transferência
  const [atualizarExtrato, setAtualizarExtrato] = useState(0);

  const recarregarDados = () => {
    setAtualizarExtrato(prev => prev + 1);
  };

  return (
    <div className="app-container">
      {/* Título Principal */}
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#6200ea' }}>TechMarket Bank 🏦</h1>
      </header>

      {/* Área de Transferência */}
      <div className="card">
        <FormularioTransferencia aoConcluir={recarregarDados} />
      </div>

      {/* Área do Extrato */}
      <div className="card">
        {/* Passamos a key para forçar o componente a recarregar quando mudar */}
        <Extrato key={atualizarExtrato} />
      </div>
    </div>
  );
}

export default App;