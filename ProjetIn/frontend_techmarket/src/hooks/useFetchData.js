// src/hooks/useFetchData.js (VERSÃO FINAL)

import { useState, useEffect } from 'react';

const useFetchData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🛑 CONDIÇÃO DE GUARDA: Não executa a busca se o endpoint for inválido ou nulo.
    if (!endpoint || typeof endpoint !== 'string') {
        setLoading(false);
        setError("Erro de configuração: O endpoint da API é inválido.");
        return; 
    }

    const fetchData = async () => {
      // Usamos 127.0.0.1 para contornar problemas de resolução de 'localhost'
      const url = `http://127.0.0.1:3000${endpoint}`; 
      
      try {
        const response = await fetch(url);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({})); 
          const errorMessage = errorData.erro || errorData.mensagem || `Erro HTTP: ${response.status}`;
          throw new Error(errorMessage);
        }
        
        const result = await response.json();
        setData(result);
        
      } catch (err) {
        let userMessage = 'Erro de comunicação com a API.';
        
        // Mensagem de erro clara para falha de rede
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError') || err.message.includes('ECONNREFUSED')) {
             userMessage = 'Erro de rede. Verifique se o servidor Node.js (porta 3000) está ativo.';
        } else {
             userMessage = err.message;
        }

        setError(`Falha ao buscar dados: ${userMessage}`);
        
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); 

  return { data, loading, error };
};

export default useFetchData;