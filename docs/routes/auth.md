
# Autenticação

## Rotas disponíveis

---

### ✅ POST /auth/login

**Descrição:**  
Realiza o login e gera um token JWT.

**Body:**

```json
{
  "email": "joao@example.com",
  "senha": "SenhaSegura!1"
}
```

**Response:**  
- `200 OK`

```json
{
  "token": "JWT_TOKEN_AQUI"
}
```

- `401 Unauthorized` caso as credenciais estejam incorretas.
