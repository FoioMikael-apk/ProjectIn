# 🏦 TechMarket Bank - Sistema Bancário Full Stack

Este projeto consiste em uma plataforma bancária web desenvolvida para garantir a integridade de transações financeiras e oferecer uma experiência de usuário moderna.

O sistema implementa uma arquitetura de microsserviços desacoplados, utilizando **Node.js** para o Back-end (com foco em propriedades ACID) e **ReactJS** para o Front-end.

## 🚀 Tecnologias Utilizadas

### Back-end
* **Node.js** (v22.14)
* **Express.js**: Framework para criação da API REST.
* **MySQL**: Banco de dados relacional.
* **mysql2**: Driver de conexão com suporte a Promises.
* **uuid**: Geração de identificadores únicos para transações.
* **CORS**: Gerenciamento de segurança para requisições cross-origin.

### Front-end
* **ReactJS** (Vite): Biblioteca para construção da interface.
* **CSS Moderno**: Uso de Variáveis CSS (`:root`) e Flexbox.
* **Custom Hooks**: Lógica encapsulada para consumo de API (`useFetchData`, `usePostData`).

---

## ✨ Funcionalidades Principais

1. **Extrato em Tempo Real:** Visualização de saldo e histórico de transações com ordenação cronológica.
2. **Transações Atômicas (ACID):** Sistema de transferência entre contas que utiliza `beginTransaction`, `commit` e `rollback` para garantir que o dinheiro nunca seja perdido em caso de falha.
3. **Segurança de API:** Configuração de CORS para proteger a comunicação entre as portas do cliente e do servidor.
4. **Interface Responsiva:** Design inspirado em Fintechs, com feedback visual de sucesso/erro e destaque para movimentações financeiras.

---

## 🛠️ Instalação e Configuração

### Pré-requisitos
* Node.js instalado.
* MySQL Server rodando.

### 1. Configuração do Banco de Dados
Execute o script SQL abaixo no seu cliente MySQL para criar o banco e as tabelas:

```sql
CREATE DATABASE techmarket_db;
USE techmarket_db;

CREATE TABLE Conta (
    ContaID INT PRIMARY KEY AUTO_INCREMENT,
    Saldo DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Transacao (
    TransacaoID VARCHAR(36) PRIMARY KEY,
    ContaOrigemID INT,
    ContaDestinoID INT,
    Valor DECIMAL(10, 2),
    DataHora DATETIME DEFAULT CURRENT_TIMESTAMP,
    Status VARCHAR(20)
);

-- Inserir dados iniciais de teste
INSERT INTO Conta (ContaID, Saldo) VALUES (1, 500.00), (2, 0.00);



2. Configurando o Back-endNavegue até a pasta do servidor:Bashcd backend_techmarket
Instale as dependências:Bashnpm install express mysql2 cors uuid
Edite o arquivo server.js e verifique as credenciais do banco (dbConfig):JavaScriptconst dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'SUA_SENHA_AQUI', // Atualize sua senha
    database: 'techmarket_db'
};
Inicie o servidor:Bashnode server.js
O terminal deve exibir: Servidor rodando na porta 30003. Configurando o Front-endAbra um novo terminal e navegue até a pasta do cliente:Bashcd frontend_techmarket
Instale as dependências:Bashnpm install
Inicie a aplicação React:Bashnpm run dev
Acesse no navegador (geralmente http://localhost:5173 ou http://localhost:3001).🔌 Documentação da APIO servidor roda em http://localhost:3000/api/v1.MétodoEndpointDescriçãoCorpo da Requisição (JSON)GET/extrato/:contaIdRetorna saldo e últimas transações.N/APOST/transferenciaRealiza transferência segura entre contas.{ "conta_origem": 1, "conta_destino": 2, "valor": 50.00 }🎨 Estrutura do ProjetoBash/ProjetIn
|-- /backend_techmarket
|   |-- server.js          # Servidor API, Lógica ACID e Configuração MySQL
|   |-- package.json
|
|-- /frontend_techmarket
    |-- /src
        |-- /components    # Componentes (Extrato, Formulario)
        |-- /hooks         # Hooks (useFetchData, usePostData)
        |-- App.jsx        # Componente Principal
        |-- App.css        # Estilização Global
📝 AutorDesenvolvido por Mikael para a disciplina de Desenvolvimento Web/Banco de Dados.Data: Dezembro/2025
