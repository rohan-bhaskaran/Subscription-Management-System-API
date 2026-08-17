export default email = ({ userName, subscriptionName, renewalDate, price, currency, daysLeft }) => {
    const subject = `Your ${subscriptionName} subscription renews in ${daysLeft} days`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${subject}</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border: 1px solid #ddd; border-radius: 6px; padding: 20px;">
          <h2 style="color: #333;">Hello ${userName},</h2>
          <p style="font-size: 16px; color: #555;">
            This is a friendly reminder that your subscription to 
            <strong>${subscriptionName}</strong> is coming up for renewal.
          </p>

          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Renewal Date</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${renewalDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Price</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${price} ${currency}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Days Left</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${daysLeft} days</td>
            </tr>
          </table>

          <p style="margin-top: 20px; font-size: 16px; color: #555;">
            Please ensure your payment method is up to date to avoid any interruption in service.
          </p>

          <p style="margin-top: 20px; font-size: 14px; color: #888;">
            – The Subscription Tracker Team
          </p>
        </div>
      </body>
    </html>
  `;

  return { html , subject};
}