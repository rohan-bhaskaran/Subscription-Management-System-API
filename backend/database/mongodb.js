import mongoose from 'mongoose';
import {DB_URI} from '../config/env.js';

const connectdb = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('Succesfully connected to db');
    } catch (err) {
        console.log(`Connection to db failed: ${err.message}`);
        process.exit(1);
    }
}

export default connectdb;