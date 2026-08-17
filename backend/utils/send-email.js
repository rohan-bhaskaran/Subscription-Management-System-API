import resend from '../config/resend.js';
import generateReminderEmail from './email-template.js';

const sendReminderEmail = async ({ to, userName, subscriptionName, renewalDate, price, currency, daysLeft }) => {
    const {html, subject} = generateReminderEmail({ userName, subscriptionName, renewalDate, price, currency, daysLeft });

    await resend.emails.send({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html
    });
}

export default sendReminderEmail;