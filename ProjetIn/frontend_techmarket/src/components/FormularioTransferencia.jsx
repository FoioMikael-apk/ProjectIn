// src/components/FormularioTransferencia.jsx

import React, { useState } from 'react';
import usePostData from '../hooks/usePostData';

function FormularioTransferencia({ aoConcluir }) {
  const { postData, loading, error } = usePostData();
  
  // Estado do formulário
  const [destino, setDestino] = useState('');
  const [valor, setValor] = useState('');
  const [sucesso, setSucesso] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSucesso(null);

    // Validação simples
    if (!destino || !valor) return;

    try {
      // Chama a API de Transferência (Rota POST do seu server.js)
      const resultado = await postData('/api/v1/transferencia', {
        conta_origem: 1,       // ⚠️ Hardcoded para teste (Conta do Mikael)
        conta_destino: parseInt(destino),
        valor: parseFloat(valor)
      });

      // Se chegou aqui, deu certo!
      setSucesso(`Transferência realizada! Novo saldo: R$ ${resultado.novo_saldo_origem.toFixed(2)}`);
      setDestino('');
      setValor('');

      // Atualiza o extrato (opcional, se você passar uma função de refresh)
      if (aoConcluir) aoConcluir();

    } catch (err) {
      // O erro já aparece na variável 'error' do hook, mas podemos logar aqui
      console.error("Falha na transferência:", err);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', marginTop: '20px', borderRadius: '8px' }}>
      <h3>Nova Transferência</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Conta Destino (ID): </label>
          <input 
            type="number" 
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            placeholder="Ex: 2"
            required
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Valor (R$): </label>
          <input 
            type="number" 
            step="0.01"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 50.00"
            required
          />
        </div>

        {/* Exibição de Erros e Sucesso */}
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>Erro: {error}</p>}
        {sucesso && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {sucesso}</p>}

        <button type="submit" disabled={loading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          {loading ? 'Processando...' : 'Transferir'}
        </button>
      </form>
    </div>
  );
}

export default FormularioTransferencia;