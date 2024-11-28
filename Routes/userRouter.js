import express from 'express';
const router=express.Router();
import { Register, Login, Logout , ForgetPassword,ResetPassword,GetResetPasswordPage} from  '../Controler/userControler.js';
router.post('/register', Register );
router.post('/login', Login )
router.get('/logout',Logout)


router.post('/forgot-password', ForgetPassword);


router.get('/reset-password', GetResetPasswordPage);

router.get('/resetpassword', ((req, res)=>{res.send("Now everything work fine") }))


router.post('/reset-password',ResetPassword);

export default router;