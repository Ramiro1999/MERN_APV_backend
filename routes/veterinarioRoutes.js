import express from 'express';
import { registrar, perfil, confirmar, autenticar, olvidepassword,comprobarToken,nuevoPassword,actualizarPerfil,actualizarPassword} from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

//area publica
router.post("/", registrar);

router.get("/confirmar/:token",confirmar);

router.post("/login",autenticar);  

router.post("/olvide-password", olvidepassword);

router.route("/olvide-password/:token").get(comprobarToken).post(nuevoPassword)
//area privada
router.get("/perfil", checkAuth, perfil);   //checkAuth permite verificar al usuario mediante JWT.

router.put('/perfil/:id',checkAuth,actualizarPerfil)

router.put('/actualizar-password',checkAuth,actualizarPassword)
export default router;