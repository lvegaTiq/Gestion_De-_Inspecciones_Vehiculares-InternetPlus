import e from 'express';
import { getData, create } from '../Controllers/Users.js';

const router = e.Router();

router.get('/users-get', getData);
 
router.post('/users-post', create);

export default router;
