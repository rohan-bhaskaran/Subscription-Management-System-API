import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/env.js';
import User from '../models/user.model.js';

const check =  async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: "Unauthorized: No token provided" });
        const token = authHeader.split(" ")[1];
    
        if (!token) return res.status(401).json({error: "Unauthorized: Invalid token"});
        const authorized = jwt.verify(token, JWT_SECRET);
    
        if (!authorized) return res.status(401).json({error: "Unauthorized: Invalid token"});
    
        const user = await User.findById(authorized.userId);
        if (!user) return res.status(401).json({error: "Unauthorized: No such user"});
        if (user.passwordChangedAt) {
            const changedAt = Math.floor(user.passwordChangedAt.getTime() / 1000);
            if (authorized.signedAt < changedAt) {
                return res.status(401).json({error: 'Password changed. Please sign in again'});
            }
        }
        req.user = user;
        next();
    } catch (err) {
       next(err);
    }
};

export default check;