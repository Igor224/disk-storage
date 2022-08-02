import {Router} from 'express';
import fileController from '../controllers/file.controller.js';
import authMiddleware from '../../../packages/middlewares/auth-middleware.js';

const router = new Router();

router.post('/upload', authMiddleware, fileController.uploadFile);
router.get('/list', authMiddleware, fileController.getFiles);
router.delete('/delete/:id', authMiddleware, fileController.deleteFile);
router.get('/:id', authMiddleware, fileController.getFileInfo);
router.get('/download/:id', authMiddleware, fileController.downloadFile);
router.put('/update/:id', authMiddleware, fileController.updateFile);

export default router;
