import express from 'express';
import {signUp, signIn, signOut, refreshToken} from '../controllers/auth.controller.js';
import { emailValidation} from '../middlewares/arcjet.middleware.js';

const router = express.Router();

router.post('/sign-up', emailValidation, signUp);
router.post('/sign-in', emailValidation, signIn);
router.post('/sign-out', signOut);
router.post('/refresh-token', refreshToken);

export default router;