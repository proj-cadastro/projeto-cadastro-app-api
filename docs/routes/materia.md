
# Matéria

## Rotas disponíveis

---

### ✅ POST /materias

**Descrição:**  
Cria uma nova matéria.

**Body:**

```json
{
  "nome": "Algoritmos",
  "cargaHoraria": 60,
  "professorId": 1
}
```

**Response:**  
- `201 Created`

---

### ✅ GET /materias

**Descrição:**  
Lista todas as matérias, incluindo professor e cursos relacionados.

**Response:**  
- `200 OK`

---

### ✅ GET /materias/:id

**Descrição:**  
Busca uma matéria por ID.

**Response:**  
- `200 OK` ou `404 Not Found`

---

### ✅ PUT /materias/:id

**Descrição:**  
Atualiza uma matéria.

**Body:**  
Qualquer campo da matéria.

**Response:**  
- `200 OK` com a matéria atualizada.

---

### ✅ DELETE /materias/:id

**Descrição:**  
Deleta uma matéria.

**Response:**  
- `204 No Content`
