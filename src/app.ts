import express from "express";
import cursoRoutes from "./modules/curso/curso.routes";
import professorRoutes from "./modules/professor/professor.routes";
import materiaRoutes from "./modules/materia/materia.routes";
import usuarioRoutes from "./modules/usuario/usuario.routes";
import authRoutes from "./modules/auth/auth.routes";
import enumRoutes from "./modules/enums/enum.routes";
import unidadeRoutes from "./modules/unidade/unidade.routes";
import monitorRoutes from "./modules/monitor/monitor.routes";
import pontoRoutes from "./modules/ponto/ponto.routes";

import path from "path";
import cors from "cors";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/cursos", cursoRoutes);
app.use("/professores", professorRoutes);
app.use("/materias", materiaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);
app.use("/enums", enumRoutes);
app.use("/static", express.static(path.join(__dirname, "..", "public")));
app.use("/unidades", unidadeRoutes);
app.use("/monitores", monitorRoutes);
app.use("/pontos", pontoRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
