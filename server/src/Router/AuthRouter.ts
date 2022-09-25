import { Router } from "express";
import AuthCtl from "../app/Controller/AuthCtl";
const router = Router();


router.post('/register', AuthCtl.register);
router.post('/login', AuthCtl.login);
router.get('/findByEmail', AuthCtl.findByEmail);
router.get('/getUser', AuthCtl.getUser);
router.get('/getUserById/:id', AuthCtl.getUserById);
router.patch('/user/:id/friendRequest', AuthCtl.friendRequest);
router.patch('/user/:id/acceptFriend', AuthCtl.acceptFriend);
router.patch('/user/:id/refuseFriend', AuthCtl.refuseFriend);
export default router;