import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarId.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async (req,res)=>{
    const {email,nombre} = req.body
    //Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email})
    if(existeUsuario){
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({msg: error.message});
    }
    try {
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        //Enviar email
        emailRegistro({
            email,
            nombre,
            token: veterinarioGuardado.token
        })
        res.json(veterinarioGuardado)

    } catch (error) {
        console.log(error)
    }
    
    
}

const perfil = (req, res) => {
    const { veterinario } = req;
    res.json(veterinario);
}

const confirmar = async (req,res) => {
    const  {token} = req.params;
    const usuarioAconfirmar = await Veterinario.findOne({token})

    if(!usuarioAconfirmar){
        const error = new Error("Token no valido")
        return res.status(400).json({msg: error.message})
    }
    try {
        usuarioAconfirmar.token = null;
        usuarioAconfirmar.confirmado=true;
        await usuarioAconfirmar.save();
        res.json({msg: "Cuenta confirmada correctamente"})
    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req,res) => {
    const {email,password} = req.body
    //comprobar si el usuario existe
    const usuarioAautenticar = await Veterinario.findOne({email})
    if(!usuarioAautenticar){
        const error = new Error("El usuario no existe")
        return res.status(404).json({msg: error.message})
    }
    //comprobar usuario confirmado
    if(!usuarioAautenticar.confirmado){
        const error = new Error("Tu cuenta no ha sido confirmada")
        return res.status(403).json({msg: error.message})
    }
    //revisar password
    if(await usuarioAautenticar.comprobarPassword(password)){
       //Autenticar JWT
        res.json({
            _id: usuarioAautenticar._id,
            nombre: usuarioAautenticar.nombre,
            email: usuarioAautenticar.email,
            token: generarJWT(usuarioAautenticar.id)
         })
    }else{
        const error = new Error("La contraseña es incorrecta")
        return res.status(403).json({msg: error.message})
    }

}

const olvidepassword = async (req,res) => {

    const {email} = req.body
    const existeVeterinario = await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error = new Error("El mail ingresado no se encuentra registrado en el sistema")
        return res.status(404).json({msg: error.message})
    }

    try {
        existeVeterinario.token = generarId();           
        await existeVeterinario.save()
        //enviar mail con instrucciones
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token
        })
        res.json({msg: "Te hemos enviado un mail con las instrucciones"})
    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req,res) => {
        const {token} = req.params
        const tokenValido = await Veterinario.findOne({token});
        if(!tokenValido){
            const error = new Error("Token no valido")
            return res.status(400).json({msg: error.message})
        }
        res.json({msg: "Token valido, y el usuario existe"})
}

const nuevoPassword = async (req,res) => {

    const {token} = req.params
    const {password} = req.body

    const veterinario = await Veterinario.findOne({token});
    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }
    try {
        veterinario.token = null;
        veterinario.password = password
        await veterinario.save();
        res.json({msg: "Contraseña modificada correctamente"})
    } catch (error) {
        console.log(error)
    }
}

const actualizarPerfil = async (req,res) => {
    const veterinario = await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }
    const {email} = req.body
    if(veterinario.email !== req.body.email){
        const existeEmail = await Veterinario.findOne({email})
        if(existeEmail){
        const error = new Error('Este email ya está en uso');
        return res.status(400).json({msg: error.message});
        }
    }
    try{
        veterinario.nombre = req.body.nombre;
        veterinario.web = req.body.web;
        veterinario.email = req.body.email;
        veterinario.telefono = req.body.telefono;
        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado)
        
    }catch(error){
        console.log(error)
    }

} 

const actualizarPassword = async (req,res) => {

    //Leer los datos
    const {id} = req.veterinario
    const {pwd_actual, pwd_nuevo} = req.body

    //Comprobar que el veterinario existe
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error("Hubo un error")
        return res.status(400).json({msg: error.message})
    }

    //Comprobar el password
    if(await veterinario.comprobarPassword(pwd_actual)){
        veterinario.password = pwd_nuevo
        await veterinario.save()
        res.json({msg: "La contraseña fue cambiada exitosamente"})
    }else{
        const error = new Error("La contraseña actual ingresada es incorrecta")
        return res.status(400).json({msg: error.message})
    }


    //Almacenar el nuevo password
}

export {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidepassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}