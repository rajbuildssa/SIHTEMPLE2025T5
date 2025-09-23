# E-Darshan Email & PDF Testing Guide

This guide explains how to test the email functionality with PDF attachments in the E-Darshan booking system.

## 📋 Prerequisites

1. **Node.js** installed on your system
2. **Gmail account** with 2-factor authentication enabled
3. **Gmail App Password** (not your regular password)

## 🚀 Quick Start

### Step 1: Setup Email Configuration

Run the setup helper script to create the `.env` file:

```bash
node setup-email.js
```

This will create a `.env` file with placeholder values. Edit the file and update:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
TEST_EMAIL=your-test-email@gmail.com
```

### Step 2: Get Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** → **2-Step Verification**
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Enter "E-Darshan System" as the name
6. Copy the generated 16-character password
7. Use this password in your `.env` file (not your regular Gmail password)

## 🧪 Test Scripts

### 1. Full Email Test with PDF (`send-test-email.js`)

**Purpose**: Complete test of email functionality with PDF attachment

**Features**:
- ✅ Email service connection verification
- ✅ PDF generation with temple theme
- ✅ QR code generation
- ✅ HTML email template
- ✅ PDF attachment
- ✅ Comprehensive test data

**Usage**:
```bash
node send-test-email.js
```

**What it does**:
- Creates a test booking with realistic data
- Generates a beautiful PDF ticket with temple branding
- Creates a QR code for entry verification
- Sends an HTML email with the PDF attached
- Provides detailed success/failure feedback

### 2. Simple Email Test (`send-real-test-email.js`)

**Purpose**: Basic email functionality test using existing email service

**Features**:
- ✅ Uses existing EmailService class
- ✅ Simple HTML email
- ✅ Quick connection test

**Usage**:
```bash
node send-real-test-email.js
```

**What it does**:
- Tests the existing email service
- Sends a simple test email
- Verifies basic email functionality

### 3. PDF Generation Test (`test-pdf-generation.js`)

**Purpose**: Test PDF generation without sending emails

**Features**:
- ✅ Multiple ticket type scenarios
- ✅ Different devotee configurations
- ✅ QR code generation
- ✅ PDF file saving
- ✅ Comprehensive test coverage

**Usage**:
```bash
node test-pdf-generation.js
```

**What it does**:
- Generates multiple PDF variations
- Tests different ticket types (Regular, VIP, Senior)
- Tests multiple devotees scenarios
- Saves PDFs to disk for inspection
- Provides detailed test results

### 4. Email Setup Helper (`setup-email.js`)

**Purpose**: Initialize email configuration

**Usage**:
```bash
node setup-email.js
```

**What it does**:
- Creates `.env` file if it doesn't exist
- Provides step-by-step setup instructions
- Checks current configuration status
- Guides through Gmail App Password setup

## 📊 Test Scenarios

### Email Test Scenarios

1. **Connection Test**: Verifies Gmail SMTP connection
2. **Authentication Test**: Tests Gmail App Password authentication
3. **Template Test**: Tests HTML email template rendering
4. **Attachment Test**: Tests PDF attachment functionality
5. **Delivery Test**: Tests actual email delivery

### PDF Test Scenarios

1. **Regular Ticket**: Single devotee, regular pricing
2. **VIP Ticket**: Premium ticket with enhanced features
3. **Senior Citizen**: Discounted pricing for seniors
4. **Family Ticket**: Multiple devotees in one booking
5. **QR Code Test**: Verifies QR code generation and scanning

## 🎯 Expected Results

### Successful Email Test
```
🚀 Starting E-Darshan Email Test with PDF...
✅ Email configuration found
📧 Using email: your-email@gmail.com
✅ Email service connection verified
📤 Sending test email to: your-test-email@gmail.com
📄 Generating PDF ticket...
✅ PDF generated successfully
📤 Sending email with PDF attachment...
✅ Test email sent successfully!
📧 Message ID: <message-id>
📎 PDF attachment: E-Darshan-Test-Ticket-TEST-1234567890.pdf
📬 Check your inbox at: your-test-email@gmail.com

🎉 Email Test Summary:
✅ Email service connection verified
✅ PDF generation successful
✅ QR code generation successful
✅ Email template rendering successful
✅ PDF attachment successful
✅ Email delivery successful
```

### Successful PDF Test
```
🚀 Testing E-Darshan PDF Generation...
✅ QR Code generated successfully
📄 Generating PDF with test data...
✅ PDF generated successfully
📁 PDF saved as: test-e-darshan-ticket-TEST-1234567890.pdf
📊 PDF size: 245.67 KB

🧪 Testing different ticket scenarios...
✅ Regular ticket PDF generated
✅ Senior citizen ticket PDF generated
✅ Multiple devotees ticket PDF generated

🎉 PDF Generation Test Summary:
✅ QR Code generation working
✅ PDF generation working
✅ Regular ticket PDF created
✅ Senior citizen ticket PDF created
✅ Multiple devotees ticket PDF created
✅ All PDFs saved to disk for inspection
```

## 🔧 Troubleshooting

### Common Issues

#### 1. "Invalid login" Error
```
❌ Email service connection failed: Invalid login
```
**Solution**: 
- Ensure you're using the Gmail App Password, not your regular password
- Verify 2-factor authentication is enabled
- Check that the App Password is correctly copied (no spaces)

#### 2. "Email configuration missing" Error
```
❌ Email configuration missing!
```
**Solution**:
- Run `node setup-email.js` to create the `.env` file
- Edit the `.env` file with your actual Gmail credentials
- Ensure the file is in the project root directory

#### 3. PDF Generation Fails
```
❌ Error during PDF generation test
```
**Solution**:
- Check that all dependencies are installed: `npm install`
- Verify the PDF generator module is accessible
- Check for any missing image files or fonts

#### 4. Email Goes to Spam
**Solution**:
- This is normal for automated emails
- Check your spam/junk folder
- Mark the email as "Not Spam" to improve future delivery

### Debug Mode

To get more detailed error information, you can modify the scripts to include additional logging:

```javascript
// Add this to any script for more detailed logging
process.env.DEBUG = 'true';
```

## 📁 Generated Files

After running the tests, you'll find these files in your project directory:

- `test-e-darshan-ticket-*.pdf` - Main test PDF
- `test-regular-ticket-*.pdf` - Regular ticket PDF
- `test-senior-ticket-*.pdf` - Senior citizen ticket PDF
- `test-multiple-ticket-*.pdf` - Multiple devotees ticket PDF

## 🚀 Production Considerations

For production deployment:

1. **Use a dedicated email service** (SendGrid, Mailgun, etc.)
2. **Set up proper DNS records** (SPF, DKIM, DMARC)
3. **Implement email retry logic**
4. **Add email delivery monitoring**
5. **Use environment-specific configurations**

## 📞 Support

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your Gmail App Password is correct
3. Ensure all dependencies are installed
4. Check the EMAIL_SETUP_README.md for detailed setup instructions

## 🎉 Success!

Once all tests pass, your E-Darshan system is ready to:
- Send booking confirmation emails
- Generate beautiful PDF tickets
- Attach PDFs to emails
- Handle QR code generation
- Process temple bookings with email notifications

Happy testing! 🏛️✨
