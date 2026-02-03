# Projeto Final – Programação Web Avançada (PWA)

## Plataforma de Recolha de Propostas de Projeto Final

Este projeto consiste numa **aplicação Web** que permite aos docentes
submeterem, gerirem e editarem propostas de temas para Projeto Final.
Os utilizadores anónimos podem consultar a lista pública de docentes registados.

---

## Funcionalidades Principais

- Lista pública de docentes (acesso anónimo)
- Autenticação de docentes com **JWT**
- CRUD de propostas do docente autenticado
- Associação de:
  - Orientador (docente autenticado)
  - Coorientadores (opcional)
  - Alunos (opcional)
- Interface responsiva (desktop e mobile)
- Formulários intuitivos e validações no backend

---

## Tecnologias Utilizadas

### Frontend
- Vue.js
- Vue Router
- Vuex
- Bootstrap 5
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)

### Base de Dados
- MongoDB (base de dados: `propostasbd`)

---

## Estrutura do Projeto

```
ProjetoFinal/
│
├── frontend/        # Aplicação Vue.js
├── backend/         # API REST (Node.js / Express)
├── database/        # Dados de exemplo (JSON)
├── Anexos/          # UML, Modelo de Dados e Mockups
└── README.md
```

---

## Pré-requisitos

- Node.js (versão 16 ou superior)
- MongoDB em execução local
- Navegador Web moderno

---

## Base de Dados (Dados de Exemplo)

A pasta `database/` contém ficheiros JSON com dados de exemplo:
- `docentes.json`
- `alunos.json`
- `propostas.json`

### Importação da Base de Dados

**Opção 1 – MongoDB Compass (recomendado):**
1. Abrir MongoDB Compass
2. Criar/selecionar a base de dados `propostasbd`
3. Importar cada ficheiro JSON para a respetiva coleção

**Opção 2 – Linha de comandos (mongoimport):**
```bash
mongoimport --db propostasbd --collection docentes --file docentes.json --jsonArray
mongoimport --db propostasbd --collection alunos --file alunos.json --jsonArray
mongoimport --db propostasbd --collection propostas --file propostas.json --jsonArray
```

---

## Credenciais de Teste

Para efeitos de demonstração e avaliação:

- **Email:** leonel.morgado@uab.pt / ricardo.baptista@uab.pt / luis.barbosa@uab.pt
- **Password:** 123456  

---

## Como Executar o Projeto

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run serve
```

A aplicação ficará disponível em:
```
http://localhost:8080
```

---

## Observações Finais

Este projeto foi desenvolvido no contexto da unidade curricular
**Programação Web Avançada**.
Alguns avisos de dependências depreciadas podem surgir durante a instalação,
não afetando o funcionamento da aplicação no contexto do projeto.

---

## Repositório GitHub

O código fonte encontra-se disponível neste repositório GitHub:
https://github.com/Joao-Machado-UAb/ProjetoFinal.git

---

**Autor:** João Machado  
**Curso:** MEIW – Universidade Aberta  
