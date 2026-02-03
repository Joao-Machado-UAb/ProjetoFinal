const mongoose = require("mongoose");

const PropostaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    orientadorId: { type: mongoose.Schema.Types.ObjectId, ref: "Docente", required: true, index: true },
    coorientadorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Docente" }],
    palavrasChave: [{ type: String, trim: true }],
    alunoIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Aluno" }],
    descricaoObjetivos: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposta", PropostaSchema);
