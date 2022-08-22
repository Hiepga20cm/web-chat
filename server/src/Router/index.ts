import { Router } from "express";
const router = Router();
import AuthRouter from './AuthRouter';
import MessageRouter from './MessageRouter';
import auth from '../../src/app/MiddleWare/auth';
router.use('/auth', AuthRouter);
router.use('/nhantin', auth.requireAuth, MessageRouter);


export default router;