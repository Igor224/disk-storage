import {Router} from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../../../packages/middlewares/auth-middleware.js';
import {validateLoginPass} from '../middlewares/validat-middleware.js';

const router = new Router();

router.post('/signup', validateLoginPass(), userController.signup);
router.post('/signin', userController.signin);
router.post('/logout', userController.logout);
router.get('/signin/new_token', userController.refresh);
router.get('/info', authMiddleware, userController.getUserInfo);

export default router;
