import {Router} from 'express';
import {register, login, loginWithGoogle} from '../handler/logicHandler.js'; 

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.post('/google', loginWithGoogle);

export default router;