import 'dotenv/config';
import { generateTicketPDF } from './server/utils/pdfGenerator.js';
import QRCode from 'qrcode';
import fs from 'fs';

// Test PDF generation functionality
async function testPDFGeneration() {
  console.log('🚀 Testing E-Darshan PDF Generation...');
  
  try {
    // Generate QR code for the test ticket
    const qrCodeData = `E-Darshan-Test-${Date.now()}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData);
    console.log('✅ QR Code generated successfully');

    // Create comprehensive test booking data
    const testBookingData = {
      id: `TEST-${Date.now()}`,
      temple: {
        name: 'Shri Krishna Temple',
        location: 'Vrindavan, Uttar Pradesh',
        contact: '+91-9876543210'
      },
      date: new Date(),
      timeSlot: '10:00 AM - 11:00 AM',
      ticketType: 'VIP Darshan',
      tickets: 3,
      amount: 750,
      status: 'confirmed',
      devotees: [
        { name: 'Ram Kumar Sharma', age: 45 },
        { name: 'Sita Devi Sharma', age: 42 },
        { name: 'Krishna Sharma', age: 12 }
      ],
      devoteeName: 'Ram Kumar Sharma',
      qrCode: qrCodeDataURL,
      paymentStatus: 'paid'
    };

    console.log('📄 Generating PDF with test data...');
    console.log('Test Data:', JSON.stringify(testBookingData, null, 2));

    // Generate PDF
    const pdfDataURI = await generateTicketPDF(testBookingData);
    console.log('✅ PDF generated successfully');

    // Save PDF to file for testing
    const pdfBuffer = Buffer.from(pdfDataURI.split(',')[1], 'base64');
    const fileName = `test-e-darshan-ticket-${testBookingData.id}.pdf`;
    fs.writeFileSync(fileName, pdfBuffer);
    
    console.log(`📁 PDF saved as: ${fileName}`);
    console.log(`📊 PDF size: ${(pdfBuffer.length / 1024).toFixed(2)} KB`);

    // Test different scenarios
    console.log('\n🧪 Testing different ticket scenarios...');

    // Test 1: Regular ticket
    const regularTicket = {
      ...testBookingData,
      id: `REG-${Date.now()}`,
      ticketType: 'Regular Darshan',
      tickets: 1,
      amount: 100,
      devotees: [{ name: 'Regular Devotee', age: 30 }],
      devoteeName: 'Regular Devotee'
    };

    const regularPDF = await generateTicketPDF(regularTicket);
    const regularBuffer = Buffer.from(regularPDF.split(',')[1], 'base64');
    fs.writeFileSync(`test-regular-ticket-${regularTicket.id}.pdf`, regularBuffer);
    console.log('✅ Regular ticket PDF generated');

    // Test 2: Senior citizen ticket
    const seniorTicket = {
      ...testBookingData,
      id: `SEN-${Date.now()}`,
      ticketType: 'Senior Citizen Darshan',
      tickets: 2,
      amount: 150,
      devotees: [
        { name: 'Senior Devotee 1', age: 65 },
        { name: 'Senior Devotee 2', age: 68 }
      ],
      devoteeName: 'Senior Devotee 1'
    };

    const seniorPDF = await generateTicketPDF(seniorTicket);
    const seniorBuffer = Buffer.from(seniorPDF.split(',')[1], 'base64');
    fs.writeFileSync(`test-senior-ticket-${seniorTicket.id}.pdf`, seniorBuffer);
    console.log('✅ Senior citizen ticket PDF generated');

    // Test 3: Multiple devotees
    const multipleDevoteesTicket = {
      ...testBookingData,
      id: `MUL-${Date.now()}`,
      ticketType: 'Family Darshan',
      tickets: 5,
      amount: 500,
      devotees: [
        { name: 'Family Head', age: 50 },
        { name: 'Spouse', age: 48 },
        { name: 'Child 1', age: 15 },
        { name: 'Child 2', age: 12 },
        { name: 'Grandparent', age: 75 }
      ],
      devoteeName: 'Family Head'
    };

    const multiplePDF = await generateTicketPDF(multipleDevoteesTicket);
    const multipleBuffer = Buffer.from(multiplePDF.split(',')[1], 'base64');
    fs.writeFileSync(`test-multiple-ticket-${multipleDevoteesTicket.id}.pdf`, multipleBuffer);
    console.log('✅ Multiple devotees ticket PDF generated');

    console.log('\n🎉 PDF Generation Test Summary:');
    console.log('✅ QR Code generation working');
    console.log('✅ PDF generation working');
    console.log('✅ Regular ticket PDF created');
    console.log('✅ Senior citizen ticket PDF created');
    console.log('✅ Multiple devotees ticket PDF created');
    console.log('✅ All PDFs saved to disk for inspection');

    console.log('\n📁 Generated Files:');
    console.log(`- ${fileName}`);
    console.log(`- test-regular-ticket-${regularTicket.id}.pdf`);
    console.log(`- test-senior-ticket-${seniorTicket.id}.pdf`);
    console.log(`- test-multiple-ticket-${multipleDevoteesTicket.id}.pdf`);

    console.log('\n💡 Next Steps:');
    console.log('1. Open the generated PDF files to verify formatting');
    console.log('2. Check that all text is readable and properly positioned');
    console.log('3. Verify QR codes are scannable');
    console.log('4. Test email functionality with: node send-test-email.js');

  } catch (error) {
    console.error('❌ Error during PDF generation test:', error.message);
    console.error('Full error:', error);
  }
}

// Run the test
testPDFGeneration().then(() => {
  console.log('\n🏁 PDF generation test completed');
  process.exit(0);
}).catch((error) => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});