// Simple QR code test utility
import QRCode from 'qrcode';

export const testQRCodeGeneration = async () => {
  try {
    console.log('Testing QR code generation...');

    const testData = JSON.stringify({
      bookingId: 'SW1049123456',
      temple: 'Dwarkadhish Temple',
      date: '2025-09-23',
      timeSlot: '10:00 AM',
      ticketType: 'VIP Darshan',
      tickets: 3
    });

    console.log('Test data:', testData);

    // Test QR code generation
    const qrCodeDataURL = await QRCode.toDataURL(testData, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    console.log('QR code generated successfully!');
    console.log('QR code length:', qrCodeDataURL.length);
    console.log('QR code starts with:', qrCodeDataURL.substring(0, 50));

    return {
      success: true,
      qrCodeDataURL,
      message: 'QR code generation working correctly'
    };

  } catch (error) {
    console.error('QR code generation failed:', error);
    console.error('Error details:', error.message, error.stack);

    return {
      success: false,
      error: error.message,
      message: 'QR code generation failed'
    };
  }
};
