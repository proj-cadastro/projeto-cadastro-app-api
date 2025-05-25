
# Curso

## Rotas disponíveis

---

### ✅ POST /cursos

**Descrição:**  
Cria um novo curso.

**Body:**

```json
{
  "nome": "Engenharia de Software",
  "codigo": "1234",
  "sigla": "ESW",
  "modelo": "PRESENCIAL",
  "coordenadorId": 1
}
```

**Response:**  
- `201 Created`

---

### ✅ GET /cursos

**Descrição:**  
Lista todos os cursos, incluindo matérias e coordenador.

**Response:**  
- `200 OK`

---

### ✅ GET /cursos/:id

**Descrição:**  
Busca um curso por ID, incluindo matérias e coordenador.

**Response:**  
- `200 OK` ou `404 Not Found`

---

### ✅ PUT /cursos/:id

**Descrição:**  
Atualiza um curso.

**Body:**  
Qualquer campo do curso.

**Response:**  
- `200 OK` com o curso atualizado.

---

### ✅ DELETE /cursos/:id

**Descrição:**  
Deleta um curso.

**Response:**  
- `204 No Content`
