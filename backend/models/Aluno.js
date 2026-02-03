const mongoose = require("mongoose");

const AlunoSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    numero: { type: Number, required: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Aluno", AlunoSchema);
