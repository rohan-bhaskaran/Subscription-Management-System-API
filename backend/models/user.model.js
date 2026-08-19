import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true, // with index query of email will be based on a b-tree index search or else normally it would go collection by collection, hence its faster
        trim: true,
        lowercase: true,
        match: /.+\@.+\.+/,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    refreshToken: {
        type: String,
        default: null
    },
    passwordChangedAt: {
        type: Date,
        default: null
    }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;