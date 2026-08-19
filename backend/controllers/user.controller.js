import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import refreshCookieOptions from '../config/cookies.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({error: "User Not Found"});

        const {password: _, ...safeUser} = user.toObject();
        res.status(200).json({user: safeUser});
    } catch (err) {
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({users});
    } catch (err) {
        next(err);
    }
}

export const changePassword = async (req, res, next) => {
     try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new password are required' });
        }

        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return res.status(401).json({ error: 'Current password is incorrect' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordChangedAt = new Date();
        user.refreshToken = null;
        await user.save();

        res.clearCookie('refreshToken', refreshCookieOptions);

        res.status(200).json({ message: 'Password changed successfully. Please sign in again.' });
    } catch (err) {
        next(err);
    }
}