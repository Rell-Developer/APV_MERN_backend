import express from 'express';
import { obtenerPacientes, agregarPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';
import checkAuth from '../middleware/outMiddleware.js';


const router = express.Router();

router
    .route('/')
    .post(checkAuth, agregarPacientes)
    .get(checkAuth, obtenerPacientes)

router
    .route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente)

export default router;