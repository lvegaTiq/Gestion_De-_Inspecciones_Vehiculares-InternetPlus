import e from "express";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

const app = e();
const port = process.env.PORT || 3000

//Routers
app.get('/', (req,res)=>{
     res.send("welcom to my API")
})

connectDB();

app.listen(port, ()=> console.log("El servidor esta funcionando", port))