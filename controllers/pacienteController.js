import Paciente from "../models/paciente.js"

const agregarPaciente = async (req,res) => {

    const paciente = new Paciente(req.body)
    paciente.veterinario = req.veterinario._id
    try {
        const pacienteAlmacenado = await paciente.save();
        res.json(pacienteAlmacenado)
    } catch (error) {
        console.log(error);
    }


}

const obtenerPacientes = async (req,res) => {

    const pacientes = await Paciente.find().where('veterinario').equals(req.veterinario);
    res.json(pacientes)

}

const obtenerPaciente = async (req,res) => {
    const {id} = req.params;

   const paciente = await Paciente.findById(id)

   if(!paciente){
        const error = new Error("El paciente no existe")
        return res.status(404).json({msg: error.message})
   }
   if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(403).json({msg: error.message})
   }
   res.json(paciente)
}


const actualizarPaciente = async (req,res) => {

    const {id} = req.params;

    const paciente = await Paciente.findById(id)
 
    if(!paciente){
         const error = new Error("El paciente no existe")
         return res.status(404).json({msg: error.message})
    }
    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
         const error = new Error("Accion no valida")
         return res.status(403).json({msg: error.message})
    }
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado)

}
const eliminarPaciente = async (req,res) => {

    const {id} = req.params;
    const paciente = await Paciente.findById(id)
    if(!paciente){
        const error = new Error("El paciente no existe")
        return res.status(404).json({msg: error.message})
   }
   if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){
        const error = new Error("Accion no valida")
        return res.status(403).json({msg: error.message})
   }
   await paciente.deleteOne();
   res.json({msg: "Paciente eliminado"})


}



export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente
}