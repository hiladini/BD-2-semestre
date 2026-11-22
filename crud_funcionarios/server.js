const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'crud_funcionarios'
};

const db = mysql.createPool(dbConfig);

// GET: listar funcionários
app.get('/api/funcionarios', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM funcionarios ORDER BY id DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao consultar funcionários.' });
  }
});

// POST: cadastrar funcionário
app.post('/api/funcionarios', async (req, res) => {
  try {
    const { nome, funcao, salario } = req.body;
    const valorSalario = Number(salario);

    if (!nome?.trim() || !funcao?.trim() || salario === '' ||
        salario === undefined || !Number.isFinite(valorSalario) || valorSalario < 0) {
      return res.status(400).json({ error: 'Preencha todos os campos corretamente.' });
    }

    const [result] = await db.execute(
      'INSERT INTO funcionarios (nome, funcao, salario) VALUES (?, ?, ?)',
      [nome.trim(), funcao.trim(), valorSalario]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar funcionário.' });
  }
});

// PUT: atualizar funcionário
app.put('/api/funcionarios/:id', async (req, res) => {
  try {
    const { nome, funcao, salario } = req.body;
    const id = Number(req.params.id);
    const valorSalario = Number(salario);

    if (!Number.isInteger(id) || id <= 0 || !nome?.trim() ||
        !funcao?.trim() || salario === '' || salario === undefined ||
        !Number.isFinite(valorSalario) || valorSalario < 0) {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }

    const [result] = await db.execute(
      'UPDATE funcionarios SET nome = ?, funcao = ?, salario = ? WHERE id = ?',
      [nome.trim(), funcao.trim(), valorSalario, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao atualizar funcionário.' });
  }
});

// DELETE: excluir funcionário
app.delete('/api/funcionarios/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido.' });
    }

    const [result] = await db.execute(
      'DELETE FROM funcionarios WHERE id = ?', [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Funcionário não encontrado.' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao excluir funcionário.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
