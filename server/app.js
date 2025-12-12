import e from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import UserRouter from "./routers/usersRouters.js";
import conductorRouters from "./routers/conductorRouters.js";
import PropietarioRouters from "./routers/propietarioRouters.js";
import VehiculoRouters from "./routers/vehiculoRouters.js";
import EstadoVehiculo from "./routers/EstadoRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();

app.use(cors());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use("/uploads", e.static(path.join(__dirname, "uploads")));

// (Opcional pero recomendado para pruebas)
app.get("/health", (req, res) => res.json({ ok: true }));

// Routers
app.use("/api", UserRouter);
app.use("/api", conductorRouters);
app.use("/api", PropietarioRouters);
app.use("/api", VehiculoRouters);
app.use("/api", EstadoVehiculo);

export default app;
