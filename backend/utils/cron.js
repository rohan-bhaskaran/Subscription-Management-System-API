import cron from 'node-cron';
import Subscription from '../models/subscription.model.js';
import sendReminderEmail from './send-email.js';

const REMINDER_DAYS = [7,5,2,1];

const startReminderCron = () => {
    cron.schedule('0 8 * * *', async () => {  //Syntax: * * * * * → minute, hour, day of month, month, day of week
        console.log('Running renewal reminder checks'); //everyday at 8 am

        const today = new Date();
        today.setHours(0, 0, 0 , 0); //sets the time to 00:00:00.000 of the same day.

        for (const day of REMINDER_DAYS) {
            const targetDate = new Date(today);
            targetDate.setDate(targetDate.getDate() + day);

            const nextDay = new Date(targetDate);
            nextDay.setDate(targetDate.getDate() + 1);

            try {
                const subscriptions = await Subscription.find({
                    status: 'active',
                    renewalDate: {$gte: targetDate , $lt: nextDay} // this way it will form in that exact 24hrs window which otherwise wouldnt have been possible with $equals
                }).populate('user', 'name email');

                for (const sub of subscriptions) {
                    await sendReminderEmail({
                        to: sub.user.email,
                        userName: sub.user.name,
                        subscriptionName: sub.name,
                        renewalDate: sub.renewalDate.toDateString();
                        price: sub.price,
                        currency: sub.currency;
                        daysLeft: day
                    })
                }
                console.log(`Reminder sent → ${sub.user.email} | ${sub.name} | ${day} days`);
            } catch (err) {
                console.log(`Error: Cron error for ${day}-day check: ${err.message}`);
            }
        }
    })
}

export default startReminderCron;