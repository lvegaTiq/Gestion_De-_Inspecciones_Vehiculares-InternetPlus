import e from "express";
import mongoose from "mongoose";
import router from "./routers/usersRouters.js";
import cors from "cors";
import connectDB from "./config/db.js";

const app = e();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

// Routers
app.use(router);

app.get('/', (req,res)=>{
     res.send("welcom to my API");
});

connectDB();

app.listen(port, ()=> console.log("El servidor esta funcionando", port));
