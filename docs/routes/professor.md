
# Professor

## Rotas disponíveis

---

### ✅ POST /professores

**Descrição:**  
Cria um novo professor.

**Body:**

```json
{
  "nome": "Carlos Almeida",
  "email": "carlos@universidade.com",
  "titulacao": "MESTRE",
  "idUnidade": "123",
  "referencia": "PES_I_A",
  "lattes": "http://lattes.cnpq.br/123456789",
  "statusAtividade": "ATIVO",
  "observacoes": "Professor substituto"
}
```

**Response:**  
- `201 Created`

---

### ✅ GET /professores

**Descrição:**  
Lista todos os professores, incluindo matérias e curso coordenado.

**Response:**  
- `200 OK`

```json
{
  "data": [
    {
      "id": 1,
      "nome": "Carlos Almeida",
      "materias": [...],
      "cursoCoordenado": {...}
    }
  ]
}
```

---

### ✅ GET /professores/:id

**Descrição:**  
Busca um professor por ID, incluindo matérias e curso coordenado.

**Response:**  
- `200 OK` ou `404 Not Found`

---

### ✅ PUT /professores/:id

**Descrição:**  
Atualiza um professor.

**Body:**  
Qualquer campo do professor.

**Response:**  
- `200 OK` com o professor atualizado.

---

### ✅ DELETE /professores/:id

**Descrição:**  
Deleta um professor.

**Response:**  
- `204 No Content`
