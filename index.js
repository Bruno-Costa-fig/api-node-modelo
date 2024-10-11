const express = require('express');
const app = express();
const cors = require('cors');
const usuariosRouter = require('./routes/usuarios');
const authRouter = require('./routes/auth');
const port = 3000;

app.use(express.json());
app.use(cors({origin: '*'}));

app.get("/", (req, res) => {
  console.log("API Funcionando!");
  res.json({ message: 'API funcionando!' });
});

app.use("/usuarios", usuariosRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});