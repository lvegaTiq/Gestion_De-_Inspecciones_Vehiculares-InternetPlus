import e from 'express';
import { actualizar, create, getData, inactivarUsuario } from '../controllers/users/Users.js';

const router = e.Router();

router.get('/users-get', getData);
router.post('/users-post', create);
router.patch('/users-inactivar/:id', inactivarUsuario);
router.put('/users-update/:id', actualizar)

export default router;