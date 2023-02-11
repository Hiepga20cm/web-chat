import { Router } from "express";
import AuthCtl from "../app/Controller/AuthCtl";
import upload from "../app/MulterConfig/MulterConfig";
const router = Router();

router.post("/register", AuthCtl.register);
router.post("/login", AuthCtl.login);
router.get("/findbyemail/:userName", AuthCtl.findByEmail);
router.get("/getUser", AuthCtl.getUser);
router.get("/getUserById/:id", AuthCtl.getUserById);
router.get("/getAllFriend", AuthCtl.getAllFriend);
router.patch("/user/:id/friendRequest", AuthCtl.friendRequest);
router.patch("/user/:id/acceptFriend", AuthCtl.acceptFriend);
router.patch("/user/:id/refuseFriend", AuthCtl.refuseFriend);
router.patch("/user/:id/cancelFriend", AuthCtl.cancelFriend);
router.get("/getFriend", AuthCtl.getAllFriend);
router.patch("/editProfile", AuthCtl.editProfile);
router.get("/changePassword", AuthCtl.changePassword);
export default router;