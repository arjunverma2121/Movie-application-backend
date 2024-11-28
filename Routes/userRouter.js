import express from 'express';
const router=express.Router();
import { Register, Login, Logout , ForgetPassword,ResetPassword,GetResetPasswordPage} from  '../Controler/userControler.js';
router.post('/register', Register );
router.post('/login', Login )
router.get('/logout',Logout)

// Forgot Password Route
router.post('/forgot-password', ForgetPassword);

// Reset Password Page Route (Render Pug Template)
router.get('/reset-password', GetResetPasswordPage);

router.get('/resetpassword', ((req, res)=>{res.send("Now everything work fine") }))

// Reset Password Logic Route
router.post('/reset-password',ResetPassword);

export default router;