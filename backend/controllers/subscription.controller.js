import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const {name, price, currency, frequency, category, startDate, paymentMethod} = req.body;
    
        if (!name || !price || !currency || !frequency || !category || !startDate || !paymentMethod) {
            return res.status(400).json({error: "name, price, currency, frequency, category, startDate, paymentMethod required"});
        }
    
        const user = req.user._id;
        const subscription = await Subscription.create({name, price, currency, frequency, category, startDate, paymentMethod, user});
        res.status(201).json({subscription: subscription.toObject()});
    } catch (err) {
        next(err);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find({user: req.user._id});
        res.status(200).json({subscriptions});
    } catch (err) {
        next(err);
    }
}

export const getSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: "Subscription not found"});
        if (subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({error: "Forbidden: Subscription does not belong to user"});
        res.status(200).json({subscription: subscription});
    } catch (err) {
        next(err);
    }
}

export const updateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: "Subscription not found"});
        if (subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({error: "Forbidden: Subscription does not belong to user"});

        const allowedUpdates = ["name","price","currency","frequency","category","startDate","paymentMethod","status"];

        Object.keys(req.body).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                subscription[key] = req.body[key];// this is called dynamic setting , subscription.key is wrong cause then js would reffer to a key called 'Key'
            }
        })
        await subscription.save();
        res.status(200).json({subscription: subscription});
    } catch (err) {
        next(err);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: "Subscription not found"}); 
        if (subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({error: "Forbidden: Subscription does not belong to user"});
        await subscription.deleteOne();
        res.status(200).json({subscription: subscription});
    } catch (err) {
        next(err);
    }
}

export const cancelSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) return res.status(404).json({error: "Subscription not found"}); 
        if (subscription.user.toString() !== req.user._id.toString()) return res.status(403).json({error: "Forbidden: Subscription does not belong to user"});

        subscription.status = 'cancelled';
        await subscription.save();
        res.status(200).json({subscription: subscription});
    } catch (err) {
        next(err);
    }
}

export const getUpcomingRenewals = async (req, res, next) => {
    try {
        const today = new Date();
        const nextWeek = new Date();
        today.setHours(0,0,0,0);
        nextWeek.setDate(nextWeek.getDate() + 7);
        const subscriptions = await Subscription.find({user: req.user._id ,status: "active" ,renewalDate: {$gte: today, $lte: nextWeek}}).sort({renewalDate: 1});
        res.status(200).json({subscriptions});
    } catch (err) {
        next(err);
    }
}
