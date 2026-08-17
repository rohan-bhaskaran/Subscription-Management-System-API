import express from 'express';
import {signUp, signIn} from '../controllers/auth.controller.js';
import { emailValidation} from '../middlewares/arcjet.middleware.js';

const router = express.Router();

router.post('/sign-up', emailValidation, signUp);
router.post('/sign-in', emailValidation, signIn);

export default router;