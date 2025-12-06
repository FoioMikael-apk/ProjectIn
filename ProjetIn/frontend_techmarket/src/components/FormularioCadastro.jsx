// src/components/FormularioCadastro.jsx

import React, { useState } from 'react';
import { validarCPF, validarIdadeMinima, validarTelefone } from '../utils/validation';

function FormularioCadastro() {
  const [formData, setFormData] = useState({
    cpf: '',
    dataNascimento: '',
    telefone: '',
    // Adicione outros campos necessários para o cadastro:
    nome: '',
    email: '',
    senha: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // Para mensagens de sucesso/erro

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Funções de Validação permanecem as mesmas (Omite-se o código para brevidade)
  const validate = () => {
    // ... Seu código de validação retorna true/false e preenche tempErrors ...
    let tempErrors = {};
    let isValid = true;

    // Incluindo checagem básica para os novos campos
    if (!formData.nome) { tempErrors.nome = "O nome é obrigatório."; isValid = false; }
    if (!formData.email || !formData.email.includes('@')) { tempErrors.email = "E-mail inválido."; isValid = false; }
    if (!formData.senha || formData.senha.length < 6) { tempErrors.senha = "A senha deve ter no mínimo 6 caracteres."; isValid = false; }

    // Suas validações originais
    if (!validarCPF(formData.cpf)) { tempErrors.cpf = "CPF deve conter 11 dígitos."; isValid = false; }
    if (!validarIdadeMinima(formData.dataNascimento, 18)) { tempErrors.dataNascimento = "A idade mínima para cadastro é 18 anos."; isValid = false; }
    if (!validarTelefone(formData.telefone)) { tempErrors.telefone = "Telefone deve ter no mínimo 10 dígitos."; isValid = false; }
    
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Limpa mensagens anteriores

    if (!validate()) {
      return; // Para a execução se a validação falhar
    }

    setLoading(true);

    try {
      // ⚠️ Use a URL correta do seu back-end, rodando na porta 3000
      const response = await fetch('http://192.168.1.8:3000/api/v1/cadastro/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Envia os dados validados em formato JSON
        body: JSON.stringify(formData), 
      });

      const data = await response.json();
      
      if (response.ok) {
        // Sucesso (Status 200, 201)
        setMessage({ type: 'success', text: "Cadastro realizado com sucesso! " + (data.mensagem || "") });
        setFormData({ // Limpa o formulário
            cpf: '', dataNascimento: '', telefone: '', nome: '', email: '', senha: ''
        });
      } else {
        // Erro do servidor (Status 4xx, 5xx)
        setMessage({ type: 'error', text: data.erro || data.mensagem || "Erro ao tentar cadastrar usuário." });
      }

    } catch (error) {
      // Erro de rede (Failed to fetch)
      console.error("Erro na comunicação com a API:", error);
      setMessage({ type: 'error', text: "Erro de rede. Verifique a conexão com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Cadastro de Usuário</h2>

      {message && (
        <p style={{ color: message.type === 'error' ? 'red' : 'green', fontWeight: 'bold' }}>
          {message.text}
        </p>
      )}
      
      {/* Campos para Nome, Email, Senha (Adicionados para um POST completo) */}
      <div>
        <label htmlFor="nome">Nome Completo:</label>
        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} />
        {errors.nome && <p style={{ color: 'red' }}>{errors.nome}</p>}
      </div>
      <div>
        <label htmlFor="email">E-mail:</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="senha">Senha:</label>
        <input type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} />
        {errors.senha && <p style={{ color: 'red' }}>{errors.senha}</p>}
      </div>

      {/* Seus campos originais (CPF, Data de Nascimento, Telefone) */}
      <div>
        <label htmlFor="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" value={formData.cpf} onChange={handleChange} maxLength="11" />
        {errors.cpf && <p style={{ color: 'red' }}>{errors.cpf}</p>}
      </div>
      <div>
        <label htmlFor="dataNascimento">Data de Nascimento:</label>
        <input type="date" id="dataNascimento" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} />
        {errors.dataNascimento && <p style={{ color: 'red' }}>{errors.dataNascimento}</p>}
      </div>
      <div>
        <label htmlFor="telefone">Telefone:</label>
        <input type="tel" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} />
        {errors.telefone && <p style={{ color: 'red' }}>{errors.telefone}</p>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}

export default FormularioCadastro;