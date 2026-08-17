import express from 'express';
import cors from 'cors';
import connectdb from './database/mongodb.js';
import {PORT} from './config/env.js';
import authRoutes from './routes/auth.routes.js';
import subscriptionRoutes from './routes/subscription.routes.js';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import {protect as arcjetMiddleware} from './middlewares/arcjet.middleware.js';
import startReminderCron from './utils/cron.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(arcjetMiddleware);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/subscriptions', subscriptionRoutes);
app.use(errorMiddleware);

connectdb().then(() => {
    app.listen(PORT, () => {
        console.log(`App is successfully running`);
        startReminderCron();
    });
});