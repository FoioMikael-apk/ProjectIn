// src/components/Extrato.jsx (VERSÃO CORRIGIDA)

import React from 'react';
import useFetchData from '../hooks/useFetchData';

function Extrato() {
  const contaIDDaSessao = 1; // ⚠️ ID da Conta que está logada (substitua por uma variável real de sessão/contexto)
  const { data, loading, error } = useFetchData('/api/v1/extrato/1');

  if (loading) {
    return <p>Carregando extrato...</p>;
  }

  if (error) {
    // Exibe a mensagem de erro que vem do useFetchData (CORS, 404, 500, etc.)
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }

  // Desestruturando os dados recebidos. O saldoAtual é uma string (ex: "10000.00")
  const { saldoAtual, transacoes } = data; 
  
  // 💡 Correção: saldoAtual já vem formatado como string, sem necessidade de .toFixed(2) aqui.
  const saldoExibido = saldoAtual || '0.00'; 
  

  return (
    <div className="extrato-container">
      <h2>Saldo Atual: R$ **{saldoExibido}**</h2>
      <hr/>
      <h3>Últimas Transações</h3>
      {transacoes && transacoes.length > 0 ? (
        <ul>
          {transacoes.map((t) => {
            const valor = parseFloat(t.Valor);
            
            // Determina se é Débito ou Crédito
            const isDebito = t.ContaOrigemID === contaIDDaSessao;
            const tipo = isDebito ? 'Débito' : 'Crédito';
            
            // 💡 Aplica o Destaque Condicional (ex: valores >= 500 em negrito/vermelho)
            const destaqueStyle = (isDebito && valor >= 500) 
                ? { color: 'red', fontWeight: 'bold' } 
                : (isDebito ? { color: 'black' } : { color: 'green' });

            return (
              <li key={t.TransacaoID} style={destaqueStyle}>
                **{tipo}** ({t.Status}): R$ {valor.toFixed(2)} - Data: **{new Date(t.DataHora).toLocaleDateString()}**
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Nenhuma transação encontrada.</p>
      )}
    </div>
  );
}

export default Extrato;