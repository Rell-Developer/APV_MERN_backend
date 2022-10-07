import express from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import { Error } from "mongoose";

// Instanciando Express
const app = express();
app.use(express.json());
dotenv.config();

conectarDB();

const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
    origin: function(origin, callback) {
        if(dominiosPermitidos.indexOf(origin) !== -1){
            // El origen del request esta permitido
            callback(null, true);
        } else {
            callback(console.log('No permitido por CORS'));
        }
    }
}

app.use(cors(corsOptions))

// Enviando datos a la pantalla
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);


// Creando el puerto
const PORT = process.env.PORT || 4000;

// Encendiendo el servidor en el puerto 4000
app.listen(PORT, () =>{
    console.log(`servidor funcionando en el puerto ${PORT}`)
});