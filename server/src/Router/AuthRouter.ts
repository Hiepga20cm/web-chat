import { Router } from "express";
import AuthCtl from "../app/Controller/AuthCtl";
const router = Router();


router.post('/register', AuthCtl.register);
router.post('/login', AuthCtl.login);
router.get('/findByEmail', AuthCtl.findByEmail);
router.get('/getUser', AuthCtl.getUser);
router.get('/getUserById/:id', AuthCtl.getUserById);
export default router;