const express = require('express');
const router = express.Router();
const db = require('../db/setup');
const bcrypt = require('bcrypt');
const authenticateToken = require('../middlewares/auth');

router.get('/', async (req, res) => {
  try {
    const usuarios = await db('usuarios').select('id', 'nome', 'email');
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id

    const usuarios = await db('usuarios').select('id', 'nome', 'email').where({ id });
    res.json(usuarios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.post('/', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).send('Nome, email e senha são obrigatórios');
    }

    const usuarioExistente = await db('usuarios').select('*').where({ email });

    if (usuarioExistente.length > 0) {
      return res.status(400).send('Email já cadastrado');
    }

    const senhaEncriptada = await bcrypt.hash(senha, 10);

    const [novoUsuario] = await db('usuarios')
      .insert({ nome, email, senha: senhaEncriptada })
      .returning('*');
    res.json(novoUsuario);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!nome && !email && !senha) {
      return res.status(400).send('Informe ao menos um campo para atualizar');
    }

    const usuario = await db('usuarios').select('*').where({ id });

    if (usuario.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const usuarioAtualizado = await db('usuarios')
      .where({ id })
      .update({ nome, email, senha })
      .returning('*');
    res.json(usuarioAtualizado);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await db('usuarios').select('*').where({ id });

    if (usuario.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    await db('usuarios').where({ id }).del();
    res.send('Usuário deletado');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
