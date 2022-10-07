import Paciente from "../models/Paciente.js";

const agregarPacientes = async (req, res) => {
    // console.log(req.body);

    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    try {
        
        const pacienteGuardado = await paciente.save();
        res.json(pacienteGuardado)

    } catch (error) {
        console.log(error)
    }
}   

const obtenerPacientes = async (req, res) => {
    
    const pacientes = await Paciente.find()
        .where('veterinario')
        .equals(req.veterinario);

    res.json(pacientes)
}   

const obtenerPaciente = async (req,res) => {
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({ msg: 'No encontrado'})
    }

    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'accion no valida'})
    }


    res.json({ paciente: paciente })
    paciente.nombre = req.body.nombre;

    try {
        const pacienteActualizado = await Paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error)
    }
} 

const actualizarPaciente = async (req,res) => {

    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({ msg: 'No encontrado'})
    }

    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'accion no valida'})
    }

    
    // Actualizar Paciente
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    
    try {
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado);
    } catch (error) {
        console.log(error)
    }
}

const eliminarPaciente = async (req,res) => {
    // Se obtiene el ID
    const { id } = req.params;

    const paciente = await Paciente.findById(id);

    if(!paciente){
        return res.json({ msg: 'No encontrado'})
    }

    if( paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        return res.json({msg: 'accion no valida'})
    }


    // Eliminar paciente
    try {
        await paciente.deleteOne();
        res.json({msg: 'Paciente Eliminado'})
    } catch (error) {
        console.log(error);
    }
}

export {
    agregarPacientes,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}