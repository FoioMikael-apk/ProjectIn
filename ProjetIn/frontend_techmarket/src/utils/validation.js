// src/utils/validation.js

// 1. Validação de CPF (Simples: apenas verifica 11 dígitos)
export const validarCPF = (cpf) => {
  if (!cpf) return false;
  // Remove caracteres não numéricos
  const cleanedCpf = cpf.replace(/[^\d]/g, ''); 
  return cleanedCpf.length === 11;
};

// 2. Validação de Idade Mínima (18 anos)
export const validarIdadeMinima = (dataNascimento, idadeMinima = 18) => {
  if (!dataNascimento) return false;

  // Cria um objeto Date para a data de nascimento
  const dataNasc = new Date(dataNascimento);
  
  // Cria um objeto Date para a data limite: hoje - idadeMinima anos
  const dataLimite = new Date();
  dataLimite.setFullYear(dataLimite.getFullYear() - idadeMinima);

  // Se a data de nascimento for menor ou igual à data limite, a pessoa é maior de idade.
  return dataNasc <= dataLimite;
};

// 3. Validação de Telefone (pelo menos 10 dígitos)
export const validarTelefone = (telefone) => {
    if (!telefone) return false;
    const cleanedTelefone = telefone.replace(/[^\d]/g, '');
    // Considera DDD + 8 ou 9 dígitos (total de 10 ou 11)
    return cleanedTelefone.length >= 10;
};