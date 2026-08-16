import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js'
import { getUser, getUsers } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/:id', authMiddleware, getUser);
router.get('/', authMiddleware, getUsers);

export default router;