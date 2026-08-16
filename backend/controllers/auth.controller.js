import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js';


export const signUp = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

        const inDB = await User.findOne({email: email});

        if (inDB) return res.status(406).json({error: "User with the email alredy exists"});
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name: name, email: email, password: hashedPassword});
        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        const {password: _, ...safeUser} = user.toObject();

        res.status(201).json({token: token, user: safeUser});
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if (!email || !password) return res.status(400).json({ error: "Email, and password are required" });
        const user = await User.findOne({email: email});

        if (!user) return res.status(404).json({error: "No User with the email found"});
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({error: "Incorrect password"});

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});
        const {password: _, ...safeUser} = user.toObject();

        res.status(201).json({token: token, user: safeUser});
    } catch (err) {
        next(err);
    }
};



