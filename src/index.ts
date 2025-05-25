import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}\n📃 Documentação Swagger em http://localhost:${PORT}/api-docs`);
});
