import nodemailer from 'nodemailer';
import { generateTicketPDF } from './pdfGenerator.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      // Gmail SMTP configuration
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // Use App Password for Gmail
        }
      });

      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email service configuration error:', error);
        } else {
          console.log('Email service is ready to send messages');
        }
      });
    } catch (error) {
      console.error('Failed to initialize email service:', error);
    }
  }

  async sendBookingConfirmation(ticket, temple) {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return false;
    }

    try {
      const { devoteeName, email, tickets, totalPrice, age, _id: ticketId } = ticket;
      const { name: templeName, location: templeLocation } = temple;

      // Calculate ticket details
      const ticketDetails = [];
      if (tickets.regular > 0) ticketDetails.push(`${tickets.regular} Regular (₹${temple.ticketPrices.regular} each)`);
      if (tickets.vip > 0) ticketDetails.push(`${tickets.vip} VIP (₹${temple.ticketPrices.vip} each)`);
      if (tickets.senior > 0) ticketDetails.push(`${tickets.senior} Senior (₹${temple.ticketPrices.senior} each)`);

      // Generate PDF with same data structure as frontend
      console.log('Generating PDF for booking confirmation...');
      const pdfData = {
        id: ticketId,
        temple: {
          name: templeName,
          location: templeLocation,
          contact: temple.contact || 'N/A'
        },
        date: new Date(),
        timeSlot: '10:00 AM', // Default time slot
        ticketType: tickets.regular > 0 ? 'Regular Darshan' : tickets.vip > 0 ? 'VIP Darshan' : 'Senior Darshan',
        tickets: (tickets.regular || 0) + (tickets.vip || 0) + (tickets.senior || 0),
        amount: totalPrice,
        status: 'confirmed',
        devotees: [{ name: devoteeName, age: age }],
        devoteeName: devoteeName,
        qrCode: ticket.qrCode,
        paymentStatus: 'paid'
      };

      const pdfDataURI = await generateTicketPDF(pdfData);
      const pdfBuffer = Buffer.from(pdfDataURI.split(',')[1], 'base64');

      const mailOptions = {
        from: `"${templeName}" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `🎫 E-Darshan Booking Confirmed - ${templeName}`,
        html: this.generateBookingConfirmationHTML({
          devoteeName,
          age,
          templeName,
          templeLocation,
          ticketId,
          ticketDetails,
          totalPrice,
          qrCode: ticket.qrCode
        }),
        attachments: [
          {
            filename: `E-Darshan-Ticket-${ticketId}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Booking confirmation email with PDF sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }
  }

  generateBookingConfirmationHTML({ devoteeName, age, templeName, templeLocation, ticketId, ticketDetails, totalPrice, qrCode }) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>E-Darshan Booking Confirmation</title>
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
            .ticket-card {
                background: white;
                color: #333;
                border-radius: 10px;
                padding: 25px;
                margin: 20px 0;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            }
            .booking-id {
                background: #e3f2fd;
                color: #1976d2;
                padding: 10px 15px;
                border-radius: 8px;
                font-weight: bold;
                text-align: center;
                margin: 15px 0;
            }
            .ticket-details {
                border-top: 2px solid #e0e0e0;
                padding-top: 20px;
                margin-top: 20px;
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
                max-width: 200px;
                height: auto;
                border: 3px solid #ddd;
                border-radius: 8px;
            }
            .important-info {
                background: #fff3cd;
                border: 1px solid #ffeaa7;
                border-radius: 8px;
                padding: 15px;
                margin: 20px 0;
            }
            .important-info h4 {
                color: #856404;
                margin-top: 0;
            }
            .important-info ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .important-info li {
                color: #856404;
                margin: 5px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid rgba(255,255,255,0.3);
                color: rgba(255,255,255,0.8);
            }
            .success-badge {
                background: #4caf50;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="temple-icon">🏛️</div>
                <h1>E-Darshan Booking Confirmed!</h1>
                <div class="success-badge">✅ Payment Successful</div>
                <div style="background: #e3f2fd; border: 1px solid #1976d2; border-radius: 8px; padding: 15px; margin: 15px 0; text-align: center;">
                    <div style="color: #1976d2; font-weight: bold; margin-bottom: 8px;">
                        📎 PDF Ticket Attached!
                    </div>
                    <p style="color: #1976d2; font-size: 14px; margin: 0;">
                        Your digital ticket PDF has been attached to this email. Download and save it for temple entry.
                    </p>
                </div>
            </div>

            <div class="ticket-card">
                <h2 style="color: #1976d2; margin-top: 0; text-align: center;">Digital Ticket</h2>
                
                <div class="booking-id">
                    Booking ID: ${ticketId}
                </div>

                <div class="ticket-details">
                    <div class="detail-row">
                        <span class="detail-label">Devotee Name:</span>
                        <span class="detail-value">${devoteeName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Age:</span>
                        <span class="detail-value">${age ? age.toString() : 'Not specified'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Temple:</span>
                        <span class="detail-value">${templeName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">${templeLocation}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tickets:</span>
                        <span class="detail-value">${ticketDetails.join(', ')}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Total Amount:</span>
                        <span class="detail-value" style="font-weight: bold; color: #4caf50;">₹${totalPrice}</span>
                    </div>
                </div>

                ${qrCode ? `
                <div class="qr-section">
                    <h4>QR Code for Entry</h4>
                    <img src="${qrCode}" alt="QR Code" class="qr-code">
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">
                        Show this QR code at the temple entrance for verification
                    </p>
                </div>
                ` : ''}
            </div>

            <div class="important-info">
                <h4>📋 Important Information</h4>
                <ul>
                    <li>Please arrive 15 minutes before your scheduled time</li>
                    <li>Carry a valid photo ID for verification</li>
                    <li>Names must match exactly with the ID</li>
                    <li>Children below 12 years are eligible for discounts</li>
                    <li>Keep this email as your digital ticket</li>
                    <li>In case of any issues, contact temple administration</li>
                </ul>
            </div>

            <div class="footer">
                <p>Thank you for choosing our E-Darshan service!</p>
                <p style="font-size: 12px;">
                    This is an automated email. Please do not reply to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  async sendTestEmail(to) {
    if (!this.transporter) {
      console.error('Email service not initialized');
      return false;
    }

    try {
      const mailOptions = {
        from: `"E-Darshan System" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: 'Test Email - E-Darshan System',
        html: `
          <h2>Test Email</h2>
          <p>This is a test email from the E-Darshan booking system.</p>
          <p>If you received this email, the email service is working correctly!</p>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Test email sent:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send test email:', error);
      return false;
    }
  }
}

export default new EmailService();
