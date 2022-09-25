import { Router } from "express";
const router = Router();
import MessageController from "../app/Controller/MessageController";

router.post('/createMessage', MessageController.createMessage);
router.get('/getConverstation/:id', MessageController.getConversations);
router.get('/getMessages/:id', MessageController.getMessages);
router.post('/message', MessageController.addMessage);
export default router;