# Resumo dos Testes automatizados

Este documento descreve cada arquivo de teste presente em `src/__tests__` e explica o que cada conjunto de testes cobre na API.

**Objetivo**: facilitar entendimento rápido dos cenários cobertos pelos testes e servir de referência para manutenção.

---

**`src/__tests__/utils/password-generator.test.ts`**:
- **Função testada**: `generateRandomPassword` (gerador de senhas).
- **Cobre**:
  - Geração com tamanho padrão (8 caracteres).
  - Geração com tamanho personalizado.
  - Validação de tamanho mínimo (forçar mínimo 6 caracteres).
  - Presença de pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial.
  - Geração de senhas distintas em chamadas consecutivas (aleatoriedade).
  - Suporte para tamanhos maiores (ex.: 20 caracteres).

**`src/__tests__/utils/jwt.test.ts`**:
- **Funções testadas**: `generateToken`, `verifyToken` (utilitário JWT).
- **Cobre**:
  - Geração de token JWT válido (estrutura com 3 partes).
  - Tokens distintos para payloads diferentes.
  - Suporte a expiração customizada.
  - Verificação de token válido e extração de payload.
  - Inclusão de claims padrão (`iat`, `exp`).
  - Erro em token inválido ou adulterado.
  - Roundtrip com payloads complexos (arrays e roles).

**`src/__tests__/utils/hash.test.ts`**:
- **Funções testadas**: `hashPassword`, `comparePassword` (hashing/senha).
- **Cobre**:
  - Hashing bem-sucedido (não igual à senha original).
  - Prefixo esperado do bcrypt (`$2b$`).
  - Hashes diferentes para a mesma senha (salt).
  - `comparePassword` retorna `true` para senha correta e `false` para incorreta.
  - Funcionamento com senhas complexas.

**`src/__tests__/utils/calculaDistancia.test.ts`**:
- **Função testada**: `calculateDistanceKm`.
- **Cobre**:
  - Cálculo da distância entre coordenadas reais (ex.: São Paulo -> Rio de Janeiro) com tolerância.
  - Retornar zero para coordenadas idênticas.
  - Cálculo para localidades em hemisférios diferentes (ex.: Nova York -> Sydney).
  - Tratamento de coordenadas negativas e tipo numérico de retorno.

**`src/__tests__/setup.ts`**:
- **Objetivo**: mocks e configuração global do Jest.
- **Cobre / define**:
  - Mock do `prisma/client` com métodos usados nos serviços (usuário, curso, materia, professor, monitor, ponto, unidade etc.).
  - Mock de utilitários como `nodemailer` e `reset-code`.
  - Observação: `hash` e `jwt` não são mockados globalmente (são mockados localmente quando necessário).
  - `beforeEach` que limpa mocks entre testes.

**`src/__tests__/services/usuario.service.test.ts`**:
- **Módulo testado**: `usuario.service` (CRUD + regras de negócio do usuário).
- **Cobre**:
  - `createUsuario`: criação com sucesso, valores padrão, vínculo com `monitor`, e falhas (usuário já existe, monitor não encontrado, monitor já vinculado).
  - `getAllUsuarios`: paginação e contagem.
  - `getUsuarioById`: retorno do usuário e erro quando não encontrado.
  - `updateUsuario`: atualização normal, hashing de senha quando atualizada, conflitos de email, tratamento de monitor (não encontrado/já vinculado/mesmo monitor).
  - `deleteUsuario`: exclusão correta.
  - `toggleUsuarioStatus`: alternância entre ativo/inativo.

**`src/__tests__/services/unidade.service.test.ts`**:
- **Módulo testado**: `unidade.service` (localização da unidade mais próxima).
- **Cobre**:
  - `buscarUnidadeProxima`: retorna unidade mais próxima dentro de 3 km.
  - Retorna `null` quando nenhuma unidade está dentro do raio.
  - Seleciona a unidade mais próxima quando há múltiplas dentro do alcance.
  - Mock de `calculateDistanceKm` para controlar distâncias nos cenários.

**`src/__tests__/services/professor.service.test.ts`**:
- **Módulo testado**: `professor.service`.
- **Cobre**:
  - `createProfessor` e `createManyProfessors` (criação simples e em lote).
  - `getAllProfessores` com e sem filtros (ex.: nome).
  - `getProfessorById` com inclusão de relações.
  - `updateProfessor` e `deleteProfessor`.
  - `isProfessorExists` para checagem de existência.

**`src/__tests__/services/ponto.service.test.ts`**:
- **Módulo testado**: `PontoService` (registro de ponto de usuários).
- **Cobre**:
  - `registrarEntrada`: sucesso; erros: usuário não existe, usuário inativo, já existe ponto aberto.
  - `registrarSaida`: sucesso; erros: ponto não existe, saída já registrada.
  - `create`: criação direta de ponto com validações (usuário existente, saída não anterior à entrada).
  - `findAll`: paginação e filtros por usuário/período.
  - `findById`, `update` (incluindo validação de horários) e `delete`.
  - `findByUsuarioId` e `getPontoAbertoByUsuario`.

**`src/__tests__/services/monitor.service.test.ts`**:
- **Módulo testado**: `MonitorService`.
- **Cobre** (fluxos principais e alternativos):
  - `create`: criação completa com transação (criação de monitor + usuário), geração/hashear senha, envio de credenciais por email, e falhas: carga horária inconsistente, professor não existe, email já cadastrado, falha no envio de email (tratamento de falha), falha na transação.
  - `findAll`: paginação.
  - `findById`: encontrado / não encontrado.
  - `update`: atualização normal, validação de horários, tratamento de `professorId` inválido, conflito de email, atualização sem usuário vinculado.
  - `delete`: exclusão com/sem usuário vinculado e erro de transação.
  - `findByProfessorId`: listar monitores por professor.

**`src/__tests__/services/materia.service.test.ts`**:
- **Módulo testado**: `materia.service`.
- **Cobre**:
  - `createMateria`: criação com e sem professor, com associação a cursos.
  - `getAllMaterias`, `getMateriaById` (incluindo relações professor/cursos).
  - `updateMateria`: atualização simples e fluxo que substitui cursos (deletar `cursoMateria`, criar novas associações).
  - `deleteMateria`: remover associações e a matéria.
  - `checkCoursesId`: validação se todos os `cursoId` existem.
  - `isMateriaUnicaEmCurso`: checagem de unicidade com base no contador.

**`src/__tests__/services/curso.service.test.ts`**:
- **Módulo testado**: `curso.service`.
- **Cobre**:
  - `createCurso`, `getAllCursos` (com relações), `getCursoById` (retorna `null` se não existe).
  - `updateCurso`, `deleteCurso`.
  - `isCursoExists`, `areCursosExist` (aceita arrays de strings ou objetos com `cursoId`).
  - `getCursosByCoordenadorId` (lista cursos de um coordenador).

**`src/__tests__/services/auth.service.test.ts`**:
- **Módulo testado**: `auth.service` (login, recuperação e alteração de senha).
- **Cobre**:
  - `loginUsuario`: sucesso (retorna token e usuário) e falhas (usuário não encontrado, usuário inativo, senha incorreta).
  - `geraTokenRecuperacaoSenha`: geração de código, envio por email e geração de token de recuperação; erro quando usuário não encontrado.
  - `comparaCodigo`: validação de código (expirado, incorreto, correto).
  - `resetarSenha`: checagens de validade do token, usuário existente e atualização de senha (com hashing).
  - `alterarSenha`: validações (usuário existe, senha atual correta) e alteração bem-sucedida.
