// src/hooks/usePostData.js

import { useState } from 'react';

const usePostData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const postData = async (endpoint, payload) => {
    setLoading(true);
    setError(null);
    setData(null);

    // ⚠️ Mantendo o IP 127.0.0.1 que funcionou para você
    const url = `http://127.0.0.1:3000${endpoint}`; 
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Captura erros do Back-end (ex: "Saldo insuficiente", "Conta não encontrada")
        const errorMsg = responseData.erro || responseData.mensagem || `Erro HTTP ${response.status}`;
        throw new Error(errorMsg);
      }

      // Sucesso!
      setData(responseData);
      return responseData;

    } catch (err) {
      let userMessage = err.message;

      if (err.message.includes('Failed to fetch')) {
          userMessage = 'Erro de rede. Verifique se o servidor Node.js está rodando.';
      }
      
      setError(userMessage);
      throw err; // Lança o erro para o componente poder reagir
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, data };
};

export default usePostData;