import 'dotenv/config';
import fs from 'fs';
import path from 'path';

// Email setup helper script
function setupEmail() {
  console.log('🔧 E-Darshan Email Setup Helper');
  console.log('================================\n');

  // Check if .env file exists
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    console.log('📝 Creating .env file...');
    
    const envContent = `# Email Configuration (Gmail SMTP)
# Replace with your actual Gmail credentials
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Test email recipient (optional - defaults to EMAIL_USER if not set)
TEST_EMAIL=your-test-email@gmail.com

# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration (if needed)
# MONGODB_URI=mongodb://localhost:27017/sihtemple

# Stripe Configuration (if needed for payments)
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Clerk Authentication (if needed)
# CLERK_SECRET_KEY=sk_test_...
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
  } else {
    console.log('✅ .env file already exists');
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Open the .env file and update the following:');
  console.log('   - EMAIL_USER: Your Gmail address');
  console.log('   - EMAIL_PASS: Your Gmail App Password (16 characters)');
  console.log('   - TEST_EMAIL: Email address to receive test emails (optional)');
  
  console.log('\n2. Gmail App Password Setup:');
  console.log('   - Go to your Google Account settings');
  console.log('   - Navigate to Security > 2-Step Verification');
  console.log('   - Scroll down to "App passwords"');
  console.log('   - Select "Mail" and "Other (Custom name)"');
  console.log('   - Enter "E-Darshan System" as the name');
  console.log('   - Copy the generated 16-character password');
  console.log('   - Use this password (not your regular Gmail password)');
  
  console.log('\n3. Test the email functionality:');
  console.log('   - Run: node send-test-email.js (for full PDF test)');
  console.log('   - Run: node send-real-test-email.js (for simple test)');
  
  console.log('\n📖 For detailed instructions, see EMAIL_SETUP_README.md');
  
  // Check current configuration
  console.log('\n🔍 Current Configuration:');
  if (process.env.EMAIL_USER && process.env.EMAIL_USER !== 'your-email@gmail.com') {
    console.log(`✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
  } else {
    console.log('❌ EMAIL_USER: Not configured (still using placeholder)');
  }
  
  if (process.env.EMAIL_PASS && process.env.EMAIL_PASS !== 'your-16-character-app-password') {
    console.log('✅ EMAIL_PASS: Configured');
  } else {
    console.log('❌ EMAIL_PASS: Not configured (still using placeholder)');
  }
  
  if (process.env.TEST_EMAIL && process.env.TEST_EMAIL !== 'your-test-email@gmail.com') {
    console.log(`✅ TEST_EMAIL: ${process.env.TEST_EMAIL}`);
  } else {
    console.log('ℹ️  TEST_EMAIL: Not set (will use EMAIL_USER)');
  }
}

// Run the setup
setupEmail();