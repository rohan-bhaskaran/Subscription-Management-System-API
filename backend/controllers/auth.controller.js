import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN, JWT_REFRESH_SECRET, NODE_ENV} from '../config/env.js';
import refreshCookieOptions from '../config/cookies.js';

const generateTokens = async (userId) => {
        const accessToken = jwt.sign(
            {userId , signedAt: Date.now()},
            JWT_SECRET,
            {expiresIn: JWT_EXPIRES_IN}
        );
        const refreshToken = jwt.sign(
            {userId , signedAt: Date.now()},
            JWT_REFRESH_SECRET,
            {expiresIn: JWT_REFRESH_EXPIRES_IN}
        );
    
        await User.findByIdAndUpdate(userId, {refreshToken});
        return {accessToken, refreshToken};
}

export const signUp = async (req, res, next) => {
    try {
        const {name, email, password} = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: "Name, email, and password are required" });

        const inDB = await User.findOne({email: email});

        if (inDB) return res.status(406).json({error: "User with the email alredy exists"});
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name: name, email: email, password: hashedPassword});
        const {accessToken, refreshToken: newRefreshToken} = await generateTokens(user._id);
        const {password: _p,refreshToken: _r, ...safeUser} = user.toObject();

        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);
        res.status(200).json({token: accessToken, user: safeUser});
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

        const {accessToken, refreshToken: newRefreshToken} = await generateTokens(user._id);
        const {password: _p,refreshToken: _r, ...safeUser} = user.toObject();

        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);
        res.status(200).json({token: accessToken, user: safeUser});
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(401).json({error: "Unauthorized: No refresh token"});

        const authorized = jwt.verify(token, JWT_REFRESH_SECRET);
        if (!authorized) return res.status(401).json({error: "Unauthorized: Invalid token"});
        
        const user = await User.findById(authorized.userId);
        if (!user) return res.status(401).json({error: "Unauthorized: Invalid token"});

        if (user.refreshToken !== token) {
            await User.findByIdAndUpdate(authorized.userId, {refreshToken: null});
            return res.status(401).json({error: "Unauthorized: Token reuse detected. Please sign in again"});
        }

        const {accessToken, refreshToken: newRefreshToken} = await generateTokens(user._id);

        res.cookie('refreshToken', newRefreshToken, refreshCookieOptions);
        res.status(200).json({token: accessToken});
    } catch (err) {
        next(err);
    }
} 

export const signOut = async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) {
            await User.findOneAndDelete({refreshToken: token}, {refreshToken: null});
        }

        res.clearCookie('refreshToken', refreshCookieOptions);
        res.status(200).json({message: 'Sign out successfull'});
    } catch (err) {
        next(err);
    }
}





