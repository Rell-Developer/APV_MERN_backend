import Veterinario from '../models/Veterinario.js';
import generarJWT from '../helpers/generarJWT.js';
import generarID from '../helpers/generarID.js';
import { Error } from 'mongoose';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

const registrar = async (req, res) =>{    

    res.json({msg: "Registrando usuario"});
    
    const { email, nombre } = req.body

    const existeUsuario = await Veterinario.findOne({
        email
    });

    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message});
        // return ('Usuario ya registrado')
    }

    try {
        // Guardar un nuevo veterinario
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email
        emailRegistro({email, nombre, token: veterinarioGuardado.token});

        res.json(veterinarioGuardado);
    } catch (error) {
        console.error(error);
    }
};

const perfil = (req, res) =>{

    const { veterinario } = req;

    res.json(veterinario);
}

const confirmar = async (req, res) =>{
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({token});

    if (!usuarioConfirmar) {
        const error = new Error('Token no valido');
        // return res.status(400).json({msg: error.message});
        return console.log('Token no valido')
    }

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        await usuarioConfirmar.save();

        console.log(usuarioConfirmar);
        res.json({msg: "Usuario confirmado correctamente"});
    } catch (error) {
        console.error(error)
    }
}

const autenticar = async (req, res) => {
    
    const { email, password } = req.body;

    // Comprobar si el usuario existe
    const usuario = await Veterinario.findOne({ email })

    if(!usuario || usuario == null){
        return res.json({msg:'El usuario no existe', error:true});
    }else{
        console.log('si existe');
    }

    // Revisar el password
    if( await usuario.comprobarPassword(password)){

        // Si el usuario no esta confirmado
        if(!usuario.confirmado){
            res.json({msg: 'Tu cuenta no ha sido confirmada', error: true});
            return
        }

        // Autenticar usuario
        res.json({
                _id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                token: generarJWT( usuario.id )
        });
    }else{
        res.json({msg: 'Password incorrecto', error:true});
        return
    }
}

const olvidePassword = async (req, res) => {
    const { email } = req.body

    const existeVeterinario = await Veterinario.findOne({email});

    if(!existeVeterinario){
        res.json({msg: 'El usuario no existe'})
        return
    }
    
    try {
        existeVeterinario.token = generarID();
        await existeVeterinario.save();

        // Enviar email con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })

        res.json({mg: 'Hemos enviado un email con las instrucciones'})
    } catch (error) {
        console.log(error)    
    }
}

const comprobarToken = async (req, res) => {
    const {token} = req.params;

    const tokenValido = await Veterinario.findOne({token});

    if(tokenValido && tokenValido != null){
        // Token es valido, el usuario existe
        res.json({msg: 'Token Valido y el usuario existe', error:false});

    }else{
        res.json({mg: 'Token no valido', error: true});
        return
    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if(!veterinario){
        res.json({msg: 'Hubo un error'});
    }
    
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();

        res.json({ msg: 'Password Modificado Correctamente'});
    } catch (error) {
        console.log(error);
    }
}

const actualizarPerfil = async (req,res) =>{
    
    const veterinario = await Veterinario.findById(req.params.id);

    if(!veterinario){
        return res.json({msg: 'Hubo un error', error: true})
    }

    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})

        if(existeEmail){
            return res.json({msg:'Ese email ya esta en uso', error: true});
        }
    }

    try {
        veterinario.nombre = req.body.nombre;
        veterinario.email = req.body.email;
        veterinario.web = req.body.web;
        veterinario.telefono = req.body.telefono;

        const veterinarioActualizado = await veterinario.save();

        res.json(veterinarioActualizado);
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword = async (req, res) => {

    // Leer los datos
    const {id} = req.veterinario;
    const {pwd_actual, pwd_nuevo} = req.body;

    
    // Comprobar que el usuario exista
    const veterinario = await Veterinario.findById(id);

    if(!veterinario){
        return res.json({msg: 'Hubo un error', error: true})
    }
    

    // Comprobar su password
    if(await veterinario.comprobarPassword(pwd_actual)){

        // Almacenar el nuevo password
        veterinario.password = pwd_nuevo;
        await veterinario.save();
        res.json({msg: 'Password Almacenado correctamente'})

        
    }else{
        return res.json({msg: 'El password actual es incorrecto', error: true});
    }

}


export {

    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}