import {Router} from 'express';
import userController from '../controllers/user.controller.js';
import authMiddleware from '../../../packages/middlewares/auth-middleware.js';
import {oneOf, check} from 'express-validator';

const router = new Router();

router.post('/registration',
  oneOf([
    check('email').isEmail(),
    check('email').isMobilePhone() // написать validation-middleware
  ]),
  check('password').isLength({min: 3, max: 32}),
  userController.registration
);

router.post('/registration', userController.registration);
router.post('/signin', userController.signin);
router.post('/logout', userController.logout);
router.get('/signin/new_token', userController.refresh);
router.post('/signup', userController.signup);
router.get('/info', authMiddleware, userController.getUserInfo);

export default router;
