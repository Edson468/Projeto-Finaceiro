require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./config/db'); // Importar o pool de conexões

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Middleware de Autenticação ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // Não autorizado

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Token inválido
        req.user = user;
        next();
    });
};

// --- Rotas de Autenticação ---

// Rota de Cadastro
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nomeCompleto, email, username, password } = req.body;

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.execute(
            'INSERT INTO users (nomeCompleto, email, username, password) VALUES (?, ?, ?, ?)',
            [nomeCompleto, email, username, hashedPassword]
        );

        res.status(201).json({ message: 'Usuário criado com sucesso!', userId: result.insertId });
    } catch (error) {
        console.error('Erro no registro:', error);
        // Verifica erro de entrada duplicada
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'E-mail ou nome de usuário já existe.' });
        }
        res.status(500).json({ message: 'Erro no servidor ao registrar usuário.' });
    }
});

// Rota de Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Usuário ou senha inválidos.' });
        }

        // Criar e assinar o token JWT
        const payload = { id: user.id, username: user.username };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, username: user.username });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
    }
});

// --- Rotas de Transações (Protegidas) ---

// Obter todas as transações do usuário logado
app.get('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [transactions] = await db.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId]);
        res.json(transactions);
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({ message: 'Erro ao buscar transações.' });
    }
});

// Adicionar uma nova transação
app.post('/api/transactions', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { description, amount, date, bank, category, type } = req.body;

        const [result] = await db.execute(
            'INSERT INTO transactions (user_id, description, amount, date, bank, category, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, description, amount, date, bank, category, type]
        );

        res.status(201).json({ message: 'Transação adicionada com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar transação:', error);
        res.status(500).json({ message: 'Erro ao adicionar transação.' });
    }
});

// Excluir uma transação
app.delete('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;

        const [result] = await db.execute(
            'DELETE FROM transactions WHERE id = ? AND user_id = ?',
            [transactionId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transação não encontrada ou não pertence ao usuário.' });
        }

        res.status(200).json({ message: 'Transação excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir transação:', error);
        res.status(500).json({ message: 'Erro ao excluir transação.' });
    }
});

// Atualizar uma transação existente
app.put('/api/transactions/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const transactionId = req.params.id;
        const { description, amount, date, bank, category, type } = req.body;

        if (!description || !amount || !date || !bank || !category || !type) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
        }

        const [result] = await db.execute(
            'UPDATE transactions SET description = ?, amount = ?, date = ?, bank = ?, category = ?, type = ? WHERE id = ? AND user_id = ?',
            [description, amount, date, bank, category, type, transactionId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transação não encontrada ou não pertence ao usuário.' });
        }

        res.status(200).json({ message: 'Transação atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao atualizar transação:', error);
        res.status(500).json({ message: 'Erro ao atualizar transação.' });
    }
});

// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});