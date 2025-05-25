
# Usuário

## Rotas disponíveis

---

### ✅ POST /usuarios

**Descrição:**  
Cria um novo usuário.

**Body:**

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "SenhaSegura!1"
}
```

**Response:**  
- `201 Created`

---

### ✅ GET /usuarios

**Descrição:**  
Lista todos os usuários.

**Response:**  
- `200 OK`

---

### ✅ GET /usuarios/:id

**Descrição:**  
Busca um usuário por ID.

**Response:**  
- `200 OK` ou `404 Not Found`

---

### ✅ PUT /usuarios/:id

**Descrição:**  
Atualiza um usuário.

**Body:**  
Qualquer campo do usuário.

**Response:**  
- `200 OK` com o usuário atualizado.

---

### ✅ DELETE /usuarios/:id

**Descrição:**  
Deleta um usuário.

**Response:**  
- `204 No Content`
