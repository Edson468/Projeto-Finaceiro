require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Configuração do Banco de Dados ---
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

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

        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO users (nomeCompleto, email, username, password) VALUES (?, ?, ?, ?)',
            [nomeCompleto, email, username, hashedPassword]
        );
        await connection.end();

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

        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
        await connection.end();

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
        const connection = await mysql.createConnection(dbConfig);
        const [transactions] = await connection.execute('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC', [userId]);
        await connection.end();
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

        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO transactions (user_id, description, amount, date, bank, category, type) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, description, amount, date, bank, category, type]
        );
        await connection.end();

        res.status(201).json({ message: 'Transação adicionada com sucesso!', id: result.insertId });
    } catch (error) {
        console.error('Erro ao adicionar transação:', error);
        res.status(500).json({ message: 'Erro ao adicionar transação.' });
    }
});

// Adicione aqui outras rotas (DELETE, UPDATE, Goals, etc.) seguindo o mesmo padrão.

// --- Iniciar o Servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});