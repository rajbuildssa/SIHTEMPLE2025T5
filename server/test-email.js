import 'dotenv/config';
import emailService from './utils/emailService.js';

// Test email functionality
async function testEmail() {
  console.log('Testing email service...');
  
  // Check if email configuration is set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    console.log('See EMAIL_SETUP_README.md for detailed instructions');
    return;
  }

  console.log('✅ Email configuration found');
  console.log(`📧 Using email: ${process.env.EMAIL_USER}`);

  // Test email sending
  const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER;
  console.log(`📤 Sending test email to: ${testEmail}`);

  try {
    const success = await emailService.sendTestEmail(testEmail);
    if (success) {
      console.log('✅ Test email sent successfully!');
      console.log('Check your inbox for the test email.');
    } else {
      console.log('❌ Failed to send test email');
    }
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
  }
}

// Run the test
testEmail().then(() => {
  console.log('Email test completed');
  process.exit(0);
}).catch((error) => {
  console.error('Test failed:', error);
  process.exit(1);
});

