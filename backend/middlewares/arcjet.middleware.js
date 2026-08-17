import express from "express";
import {aj, emailAj} from "../config/arcjet.js";

const protect = async (req , res, next) => {
    try {
        const decision = await aj.protect(req, {requested: 1});
    
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) return res.status(429).json({error: "Too many requests"});
            if (decision.reason.isBot()) return res.status(403).json({error: "Forbidden"});
            
            return res.status(403).json({error: "Forbidden"});
        }

        next();
    } catch (err) {
        console.log(`Arcjet error ${err}`);
        next(err);
    }
}

const emailValidation = async (req, res, next) => {
    try {
        const decision = await emailAj.protect(req, {email: req.body.email});
        if (decision.isDenied()) return res.status(403).json({error: "Cant use disposible or invalid email"});
       
        next();
    } catch (err) {
        console.log(`Arcjet error ${err}`);
        next(err);
    }
}

export {protect, emailValidation};