import 'dotenv/config';
import nodemailer from 'nodemailer';
import { generateTicketPDF } from './server/utils/pdfGenerator.js';
import QRCode from 'qrcode';

// Test email functionality with PDF attachment
async function sendTestEmailWithPDF() {
  console.log('🚀 Starting E-Darshan Email Test with PDF...');
  
  // Check if email configuration is set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.log('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    console.log('See EMAIL_SETUP_README.md for detailed instructions');
    console.log('\nExample .env file:');
    console.log('EMAIL_USER=your-email@gmail.com');
    console.log('EMAIL_PASS=your-16-character-app-password');
    return;
  }

  console.log('✅ Email configuration found');
  console.log(`📧 Using email: ${process.env.EMAIL_USER}`);

  // Create nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Verify connection
  try {
    await transporter.verify();
    console.log('✅ Email service connection verified');
  } catch (error) {
    console.error('❌ Email service connection failed:', error.message);
    return;
  }

  // Test email recipient
  const testEmail = process.env.TEST_EMAIL || process.env.EMAIL_USER;
  console.log(`📤 Sending test email to: ${testEmail}`);

  try {
    // Generate QR code for the test ticket
    const qrCodeData = `E-Darshan-Test-${Date.now()}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);

    // Create test booking data
    const testBookingData = {
      id: `TEST-${Date.now()}`,
      temple: {
        name: 'Shri Krishna Temple',
        location: 'Vrindavan, Uttar Pradesh',
        contact: '+91-9876543210'
      },
      date: new Date(),
      timeSlot: '10:00 AM - 11:00 AM',
      ticketType: 'Regular Darshan',
      tickets: 2,
      amount: 200,
      status: 'confirmed',
      devotees: [
        { name: 'Test Devotee 1', age: 35 },
        { name: 'Test Devotee 2', age: 28 }
      ],
      devoteeName: 'Test Devotee 1',
      qrCode: qrCodeDataURL,
      paymentStatus: 'paid'
    };

    console.log('📄 Generating PDF ticket...');
    
    // Generate PDF
    const pdf = await generateTicketPDF(testBookingData);
    const pdfDataURI = pdf.output('datauristring');
    const pdfBuffer = Buffer.from(pdfDataURI.split(',')[1], 'base64');

    console.log('✅ PDF generated successfully');

    // Create email content
    const mailOptions = {
      from: `"E-Darshan Test System" <${process.env.EMAIL_USER}>`,
      to: testEmail,
      subject: '🎫 Test Email - E-Darshan Booking with PDF Attachment',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>E-Darshan Test Email</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }
                .container {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    padding: 30px;
                    color: white;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .temple-icon {
                    font-size: 48px;
                    margin-bottom: 15px;
                }
                .test-badge {
                    background: #ff9800;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 20px;
                    font-size: 14px;
                    font-weight: bold;
                    display: inline-block;
                    margin: 10px 0;
                }
                .pdf-notice {
                    background: #e3f2fd;
                    border: 1px solid #1976d2;
                    border-radius: 8px;
                    padding: 15px;
                    margin: 15px 0;
                    text-align: center;
                }
                .pdf-notice h3 {
                    color: #1976d2;
                    margin-top: 0;
                }
                .pdf-notice p {
                    color: #1976d2;
                    margin: 5px 0;
                }
                .ticket-info {
                    background: white;
                    color: #333;
                    border-radius: 10px;
                    padding: 25px;
                    margin: 20px 0;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                }
                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 10px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid #f0f0f0;
                }
                .detail-label {
                    font-weight: 600;
                    color: #666;
                }
                .detail-value {
                    color: #333;
                }
                .qr-section {
                    text-align: center;
                    margin: 25px 0;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .qr-code {
                    max-width: 150px;
                    height: auto;
                    border: 3px solid #ddd;
                    border-radius: 8px;
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.3);
                    color: rgba(255,255,255,0.8);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="temple-icon">🏛️</div>
                    <h1>E-Darshan Test Email</h1>
                    <div class="test-badge">🧪 TEST EMAIL</div>
                    <div class="pdf-notice">
                        <h3>📎 PDF Ticket Attached!</h3>
                        <p>Your test digital ticket PDF has been attached to this email.</p>
                        <p>This demonstrates the PDF generation and email attachment functionality.</p>
                    </div>
                </div>

                <div class="ticket-info">
                    <h2 style="color: #1976d2; margin-top: 0; text-align: center;">Test Ticket Details</h2>
                    
                    <div style="background: #e3f2fd; color: #1976d2; padding: 10px 15px; border-radius: 8px; font-weight: bold; text-align: center; margin: 15px 0;">
                        Booking ID: ${testBookingData.id}
                    </div>

                    <div class="detail-row">
                        <span class="detail-label">Devotee Name:</span>
                        <span class="detail-value">${testBookingData.devoteeName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Temple:</span>
                        <span class="detail-value">${testBookingData.temple.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${testBookingData.temple.location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Time Slot:</span>
                        <span class="detail-value">${testBookingData.timeSlot}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Ticket Type:</span>
                        <span class="detail-value">${testBookingData.ticketType}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Number of Tickets:</span>
                        <span class="detail-value">${testBookingData.tickets}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value" style="font-weight: bold; color: #4caf50;">₹${testBookingData.amount}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value" style="color: #4caf50; font-weight: bold;">${testBookingData.status.toUpperCase()}</span>
                    </div>
                </div>

                <div class="qr-section">
                    <h4>QR Code for Entry</h4>
                    <img src="${qrCodeDataURL}" alt="QR Code" class="qr-code">
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        This QR code is for testing purposes only
                    </p>
                </div>

                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                    <h4 style="color: #856404; margin-top: 0;">📋 Test Information</h4>
                    <ul style="color: #856404; margin: 10px 0; padding-left: 20px;">
                        <li>This is a test email to verify email functionality</li>
                        <li>The PDF attachment demonstrates PDF generation capability</li>
                        <li>QR code generation is working correctly</li>
                        <li>Email template rendering is functional</li>
                        <li>All booking data is properly formatted</li>
                    </ul>
                </div>

                <div class="footer">
                    <p>✅ E-Darshan Email System Test Successful!</p>
                    <p style="font-size: 12px;">
                        This is a test email generated at ${new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `E-Darshan-Test-Ticket-${testBookingData.id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    console.log('📤 Sending email with PDF attachment...');
    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📎 PDF attachment: E-Darshan-Test-Ticket-${testBookingData.id}.pdf`);
    console.log(`📬 Check your inbox at: ${testEmail}`);
    
    console.log('\n🎉 Email Test Summary:');
    console.log('✅ Email service connection verified');
    console.log('✅ PDF generation successful');
    console.log('✅ QR code generation successful');
    console.log('✅ Email template rendering successful');
    console.log('✅ PDF attachment successful');
    console.log('✅ Email delivery successful');

  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
sendTestEmailWithPDF().then(() => {
  console.log('\n🏁 Email test completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});