require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Docente = require("./models/Docente");
const Aluno = require("./models/Aluno");
const Proposta = require("./models/Proposta");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB ligado"))
  .catch((err) => {
    console.error("❌ Erro a ligar ao MongoDB:", err.message);
    process.exit(1);
  });

function signToken(docente) {
  return jwt.sign(
    { id: docente._id.toString(), email: docente.email, nome: docente.nome },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const [type, token] = auth.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Não autenticado. Envie Bearer token." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

function toUniqueStringArray(v) {
  if (!Array.isArray(v)) return [];
  return [...new Set(v.map(String))];
}

function containsId(arr, id) {
  const sid = String(id);
  return (arr || []).some((x) => String(x) === sid);
}

/**
 * =========================
 * Rotas públicas (anónimo)
 * =========================
 */
app.get("/api/health", (req, res) => res.json({ ok: true }));

app.get("/api/docentes", async (req, res) => {
  try {
    const docentes = await Docente.find({}, { passwordHash: 0, tokenSessao: 0 }).sort({ nome: 1 });
    res.json(docentes);
  } catch (e) {
    res.status(500).json({ message: "Erro ao listar docentes." });
  }
});

/**
 * =========================
 * Autenticação (docentes)
 * =========================
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const { nome, email, password } = req.body || {};
    if (!nome || !email || !password) {
      return res.status(400).json({ message: "nome, email e password são obrigatórios." });
    }

    const existing = await Docente.findOne({ email: String(email).toLowerCase().trim() });
    if (existing) return res.status(409).json({ message: "Email já registado." });

    const passwordHash = await bcrypt.hash(password, 10);
    const docente = await Docente.create({ nome, email, passwordHash });

    const token = signToken(docente);
    docente.tokenSessao = token; // opcional
    await docente.save();

    res.status(201).json({ message: "Docente registado.", token, docente: { id: docente._id, nome: docente.nome, email: docente.email } });
  } catch (e) {
    res.status(500).json({ message: "Erro no registo." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "email e password são obrigatórios." });

    const docente = await Docente.findOne({ email: String(email).toLowerCase().trim() });
    if (!docente) return res.status(401).json({ message: "Credenciais inválidas." });

    const ok = await bcrypt.compare(password, docente.passwordHash);
    if (!ok) return res.status(401).json({ message: "Credenciais inválidas." });

    const token = signToken(docente);
    docente.tokenSessao = token; // opcional (como no projeto de referência)
    await docente.save();

    res.json({ message: "Login bem-sucedido.", token, docente: { id: docente._id, nome: docente.nome, email: docente.email } });
  } catch (e) {
    res.status(500).json({ message: "Erro no login." });
  }
});

// obter o docente autenticado
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const docente = await Docente.findById(req.user.id, { passwordHash: 0, tokenSessao: 0 });
    if (!docente) return res.status(401).json({ message: "Sessão inválida." });

    res.json({
      docente: {
        id: docente._id,
        nome: docente.nome,
        email: docente.email,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Erro a validar sessão." });
  }
});


/**
 * =========================
 * Rotas protegidas
 * =========================
 */
app.get("/api/alunos", authMiddleware, async (req, res) => {
  try {
    const alunos = await Aluno.find({}).sort({ nome: 1 });
    res.json(alunos);
  } catch (e) {
    res.status(500).json({ message: "Erro ao listar alunos." });
  }
});

// criar aluno
app.post("/api/alunos", authMiddleware, async (req, res) => {
  try {
    const { nome, numero, email } = req.body || {};
    if (!nome || numero === undefined) return res.status(400).json({ message: "nome e numero são obrigatórios." });

    const aluno = await Aluno.create({ nome, numero, email });
    res.status(201).json(aluno);
  } catch (e) {
    // duplicados / validações
    res.status(400).json({ message: "Erro ao criar aluno.", error: e.message });
  }
});

// minhas propostas
app.get("/api/propostas/minhas", authMiddleware, async (req, res) => {
  try {
    const propostas = await Proposta.find({ orientadorId: req.user.id })
      .populate("orientadorId", "nome email")
      .populate("coorientadorIds", "nome email")
      .populate("alunoIds", "nome numero email")
      .sort({ updatedAt: -1 });

    res.json(propostas);
  } catch (e) {
    res.status(500).json({ message: "Erro ao listar propostas." });
  }
});

// criar proposta (orientador = docente autenticado)
app.post("/api/propostas", authMiddleware, async (req, res) => {
  try {
    const {
      titulo,
      coorientadorIds = [],
      palavrasChave = [],
      alunoIds = [],
      descricaoObjetivos
    } = req.body || {};

    // normalizar (evita duplicados)
    const coIds = toUniqueStringArray(coorientadorIds);
    const alIds = toUniqueStringArray(alunoIds);

    // regra: orientador não pode ser coorientador
    if (containsId(coIds, req.user.id)) {
      return res.status(400).json({
        message: "O orientador não pode ser coorientador da própria proposta."
      });
    }

    if (!titulo || !descricaoObjetivos) {
      return res.status(400).json({ message: "titulo e descricao. Objetivos são obrigatórios." });
    }

    // validar coorientadores (têm de existir)
    if (coIds.length) {
      const count = await Docente.countDocuments({ _id: { $in: coIds } });
      if (count !== coIds.length) {
        return res.status(400).json({ message: "Um ou mais coorientadores não existem na base de dados." });
      }
    }

    // validar alunos (têm de existir)
    if (alIds.length) {
      const count = await Aluno.countDocuments({ _id: { $in: alIds } });
      if (count !== alIds.length) {
        return res.status(400).json({ message: "Um ou mais alunos não existem na base de dados." });
      }
    }

    const proposta = await Proposta.create({
      titulo,
      orientadorId: req.user.id,
      coorientadorIds: coIds,
      palavrasChave,
      alunoIds: alIds,
      descricaoObjetivos,
    });

    const populated = await Proposta.findById(proposta._id)
      .populate("orientadorId", "nome email")
      .populate("coorientadorIds", "nome email")
      .populate("alunoIds", "nome numero email");

    return res.status(201).json(populated);
  } catch (e) {
    return res.status(400).json({ message: "Erro ao criar proposta.", error: e.message });
  }
});


// editar proposta (orientador autenticado)
app.put("/api/propostas/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const proposta = await Proposta.findById(id);
    if (!proposta) return res.status(404).json({ message: "Proposta não encontrada." });

    if (proposta.orientadorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sem permissões para alterar esta proposta." });
    }

    const { titulo, coorientadorIds, palavrasChave, alunoIds, descricaoObjetivos } = req.body || {};

    // normalizar
    const coIds = toUniqueStringArray(coorientadorIds);
    const alIds = toUniqueStringArray(alunoIds);

    // regra: orientador não pode ser coorientador
    if (coorientadorIds && containsId(coIds, req.user.id)) {
      return res.status(400).json({
        message: "O orientador não pode ser coorientador da própria proposta."
      });
    }

    if (coorientadorIds && Array.isArray(coorientadorIds)) {
      const count = await Docente.countDocuments({ _id: { $in: coIds } });
      if (count !== coIds.length) {
        return res.status(400).json({ message: "Um ou mais coorientadores não existem na base de dados." });
      }
    }


    if (alunoIds && Array.isArray(alunoIds)) {
      const count = await Aluno.countDocuments({ _id: { $in: alIds } });
      if (count !== alIds.length) {
        return res.status(400).json({ message: "Um ou mais alunos não existem na base de dados." });
      }
    }

    if (titulo !== undefined) proposta.titulo = titulo;
    if (palavrasChave !== undefined) proposta.palavrasChave = palavrasChave;
    if (descricaoObjetivos !== undefined) proposta.descricaoObjetivos = descricaoObjetivos;
    if (coorientadorIds !== undefined) proposta.coorientadorIds = coIds;
    if (alunoIds !== undefined) proposta.alunoIds = alIds;

    await proposta.save();

    const populated = await Proposta.findById(proposta._id)
      .populate("orientadorId", "nome email")
      .populate("coorientadorIds", "nome email")
      .populate("alunoIds", "nome numero email");

    res.json(populated);
  } catch (e) {
    res.status(400).json({ message: "Erro ao atualizar proposta.", error: e.message });
  }
});

// apagar proposta (orientador autenticado)
app.delete("/api/propostas/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const proposta = await Proposta.findById(id);
    if (!proposta) return res.status(404).json({ message: "Proposta não encontrada." });

    if (proposta.orientadorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Sem permissões para apagar esta proposta." });
    }

    await Proposta.deleteOne({ _id: id });
    res.json({ message: "Proposta apagada." });
  } catch (e) {
    res.status(400).json({ message: "Erro ao apagar proposta.", error: e.message });
  }
});

app.listen(PORT, () => console.log(`🚀 API a correr em http://localhost:${PORT}`));
