import User from '../models/user.model.js';

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({error: "User Not Found"});

        const {password: _, safeUser} = user;
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