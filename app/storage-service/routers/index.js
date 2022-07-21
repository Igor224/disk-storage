import {Router} from 'express';
import fileController from '../controllers/file.controller';
import authMiddleware from '../middlewares/auth-middleware';

const router = new Router();


router.post('/file/upload', authMiddleware, fileController.uploadFile);
router.get('/file/list', authMiddleware, fileController.getFiles);
router.delete('/file/delete/:id', authMiddleware, fileController.deleteFile);
router.get('/file/:id', authMiddleware, fileController.fileInfo);
router.get('/file/download/:id', authMiddleware, fileController.downloadFile);
router.put('/file/update:id', authMiddleware, fileController.updateFile);

export default router;
