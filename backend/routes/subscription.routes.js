import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { getUserSubscriptions, createSubscription, getUpcomingRenewals,getSubscriptionById,updateSubscription, deleteSubscription,cancelSubscription } from '../controllers/subscription.controller.js';

const router = express.Router();

router.route('/')
    .get(authMiddleware, getUserSubscriptions)
    .post(authMiddleware, createSubscription);

router.get('/upcoming', authMiddleware, getUpcomingRenewals);

router.route('/:id')
    .get(authMiddleware, getSubscriptionById)
    .put(authMiddleware, updateSubscription)
    .delete(authMiddleware, deleteSubscription);

router.put('/:id/cancel', authMiddleware, cancelSubscription);

export default router;