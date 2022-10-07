import jwt from 'jsonwebtoken';
import Veterinario from '../models/Veterinario.js';

const checkAuth = async (req, res, next) =>{

    console.log(req.headers.authorization);
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        
        try {
            token = req.headers.authorization.split(' ')[1];

            console.log("");
            console.log(token)
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            req.veterinario = await Veterinario.findById(decoded.id).select("-password -token -confirmado");

            console.log(req.veterinario);
            return next();
        } catch (error) {
            console.log(error)
            res.json({ msg: 'Token no valido o inexistente'});
        }
    }
    
    // No hubo token
    if(!token){
        res.json({ msg: 'Token no valido o inexistente'});
    }
    next();
}

export default checkAuth;