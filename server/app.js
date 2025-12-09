import e from "express";
import mongoose from "mongoose";
import UserRouter from "./routers/usersRouters.js";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import conductorRouters from './routers/conductorRouters.js'
import PropietarioRouters from './routers/propietarioRouters.js'
import VehiculoRouters from './routers/vehiculoRouters.js'
import EstadoVehiculo from './routers/EstadoRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = e();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use("/uploads", e.static(path.join(__dirname, "uploads")));

// Routers
app.use('/api', UserRouter);
app.use('/api', conductorRouters);
app.use('/api', PropietarioRouters);
app.use('/api', VehiculoRouters);
app.use('/api', EstadoVehiculo);

connectDB();

app.listen(port, ()=> console.log("El servidor esta funcionando", port));
