import e from 'express';
import { create, getData } from '../controllers/users/Users.js';

const router = e.Router();

router.get('/users-get', getData);
router.post('/users-post', create);

export default router;