# Email Setup Instructions for E-Darshan Booking System

This document explains how to configure email functionality for sending booking confirmation emails to devotees.

## Prerequisites

1. A Gmail account
2. App Password enabled for Gmail (not your regular password)

## Gmail Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Google Account settings
2. Navigate to Security > 2-Step Verification
3. Scroll down to "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "E-Darshan System" as the name
6. Copy the generated 16-character password

## Environment Configuration

Add the following variables to your `.env` file in the server directory:

```env
# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
```

**Important Notes:**
- Use your Gmail address for `EMAIL_USER`
- Use the 16-character app password (not your regular Gmail password) for `EMAIL_PASS`
- The app password should look like: `abcd efgh ijkl mnop`

## Testing Email Functionality

### Method 1: Test Endpoint
Send a POST request to test email functionality:

```bash
curl -X POST http://localhost:5001/api/bookings/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Method 2: Create a Test Booking
1. Go to the E-Darshan booking page
2. Complete a booking with a valid email address
3. Check the email inbox for the confirmation

## Email Features

### Automatic Email Sending
- Emails are sent automatically after successful payment (Stripe webhook)
- Emails are sent for demo bookings (non-payment bookings)
- Email sending failures don't affect booking success

### Email Content
The confirmation email includes:
- Booking ID and devotee details
- Temple information and location
- Ticket details and pricing
- QR code for entry verification
- Important instructions and guidelines
- Professional HTML formatting

### Email Template
- Responsive design that works on all devices
- Temple branding and colors
- Clear ticket information layout
- QR code for easy scanning
- Important instructions section

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Ensure you're using the app password, not your regular Gmail password
   - Verify 2-factor authentication is enabled

2. **"Less secure app access" error**
   - This shouldn't occur with app passwords
   - Make sure you're using the correct app password format

3. **Emails not being sent**
   - Check server logs for error messages
   - Verify environment variables are set correctly
   - Test with the test endpoint first

4. **Emails going to spam**
   - This is normal for automated emails
   - Consider setting up SPF, DKIM records for production

### Server Logs
Check the server console for email-related logs:
- "Email service is ready to send messages" - Configuration successful
- "Booking confirmation email sent successfully" - Email sent successfully
- "Failed to send booking confirmation email" - Email sending failed

## Production Considerations

For production deployment:

1. **Use a dedicated email service** (SendGrid, Mailgun, etc.) instead of Gmail
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Monitor email delivery rates**
4. **Implement email templates management**
5. **Add email retry logic for failed sends**

## Security Notes

- Never commit `.env` files to version control
- Use environment-specific email accounts
- Monitor email sending for abuse
- Implement rate limiting for email endpoints

