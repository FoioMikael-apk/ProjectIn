// server.js (Corrigido com CORS e Queries em snake_case)

const express = require('express');
const cors = require('cors'); 
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const app = express();

// --- CONFIGURAÇÃO CORS ---
const corsOptions = {
    // ⚠️ MUDANÇA AQUI: De 5173 para 3001 (ou adicione as duas)
    origin: ['http://localhost:5173', 'http://localhost:3001'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use(cors(corsOptions)); 
// --- FIM CONFIGURAÇÃO CORS ---

app.use(express.json());

// Configuração de Conexão com o MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root', 
    password: '308076', 
    database: 'techmarket_db'
};

// =======================================================
// ROTA GET: EXTRATO (Solução do Problema)
// =======================================================
// server.js (Apenas a Rota GET corrigida para PascalCase)
// ...

// ⚠️ IMPORTANTE: Adicionar uma rota GET para o Extrato
// server.js (Apenas a Rota GET corrigida para a Coluna 'Data')

// server.js (Apenas a Rota GET corrigida)

// server.js (Apenas a Rota GET corrigida para usar TransacaoID na ordenação)

app.get('/api/v1/extrato/:contaId', async (req, res) => {
    const { contaId } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        
        // 1. Busca de Transações
        // ✨ CORREÇÃO FINAL: Ordenando por 'DataHora' (o nome real da coluna, conforme seu JSON)
        const [transacoes] = await connection.execute(
            'SELECT * FROM Transacao WHERE ContaOrigemID = ? OR ContaDestinoID = ? ORDER BY DataHora DESC LIMIT 10', 
            [contaId, contaId]
        );
        
        // 2. Busca de Saldo
        const [saldo] = await connection.execute('SELECT Saldo FROM Conta WHERE ContaID = ?', [contaId]);

        // Formatação do Saldo
        const saldoFormatado = saldo[0] ? parseFloat(saldo[0].Saldo).toFixed(2) : "0.00";

        return res.status(200).json({
            // Retorna o saldo formatado como string
            saldoAtual: saldoFormatado, 
            transacoes: transacoes
        });

    } catch (error) {
        // Agora, se houver erro, provavelmente será de conexão ou uma falha inesperada.
        console.error("Erro fatal na busca do extrato:", error);
        return res.status(500).json({ erro: "Erro interno ao buscar dados do extrato." });
    } finally {
        if (connection) connection.end();
    }
});

// =======================================================
// ROTA POST: TRANSFERÊNCIA (Seu código original)
// =======================================================
app.post('/api/v1/transferencia', async (req, res) => {
    const { conta_origem, conta_destino, valor } = req.body;
    const transacaoId = uuidv4();

    if (!conta_origem || !conta_destino || !valor || valor <= 0) {
        return res.status(400).json({ erro: "Dados de entrada inválidos." });
    }

    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction(); 
        

        // Ajuste aqui também se seus nomes de colunas usam snake_case
        const [rows] = await connection.execute('SELECT Saldo, ContaID FROM Conta WHERE ContaID = ? FOR UPDATE', [conta_origem]);
        const contaOrigem = rows[0];

        if (!contaOrigem) {
            await connection.rollback();
            return res.status(404).json({ erro: "Conta de origem não encontrada." });
        }
        if (contaOrigem.Saldo < valor) {
            await connection.rollback();
            await connection.execute('INSERT INTO Transacao (TransacaoID, ContaOrigemID, ContaDestinoID, Valor, Status) VALUES (?, ?, ?, ?, ?)',
                [transacaoId, conta_origem, conta_destino, valor, 'FALHA_SALDO']);
            await connection.commit(); 
            return res.status(400).json({ erro: "Saldo insuficiente.", codigo_operacao: transacaoId });
        }

        await connection.execute('UPDATE Conta SET Saldo = Saldo - ? WHERE ContaID = ?', [valor, conta_origem]);

        const [resDestino] = await connection.execute('UPDATE Conta SET Saldo = Saldo + ? WHERE ContaID = ?', [valor, conta_destino]);

        if (resDestino.affectedRows === 0) {
            await connection.rollback(); 
            return res.status(404).json({ erro: "Conta de destino não encontrada. Transação revertida." });
        }
        
        await connection.execute('INSERT INTO Transacao (TransacaoID, ContaOrigemID, ContaDestinoID, Valor, Status) VALUES (?, ?, ?, ?, ?)',
            [transacaoId, conta_origem, conta_destino, valor, 'CONCLUIDA']);

        await connection.commit(); 

        return res.status(201).json({ 
            mensagem: "Transferência realizada com sucesso.",
            codigo_operacao: transacaoId,
            novo_saldo_origem: contaOrigem.Saldo - valor 
        });

    } catch (error) {
        console.error("Erro na transação:", error);
        if (connection) await connection.rollback(); 
        return res.status(500).json({ erro: "Erro interno do servidor durante a transação." });
    } finally {
        if (connection) connection.end();
    }
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});