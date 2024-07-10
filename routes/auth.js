const express = require('express');
const router = express.Router();
const db = require('../db/setup');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuarios = await db('usuarios').select('*').where({ email });

    if (usuarios.length === 0) {
      return res.status(404).send('Usuário não encontrado');
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).send('Senha incorreta');
    }

    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ user: {id: usuario.id, nome: usuario.nome, email: usuario.email}, token: token});
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;