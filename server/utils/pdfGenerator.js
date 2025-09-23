import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

async function fetchImageAsDataURL(url) {
  try {
    if (!url) return null;
    const res = await fetch(url, { mode: 'cors' });
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export const generateTicketPDF = async (bookingData) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Colors and styling
  const primaryColor = [139, 69, 19]; // Saddle brown for temple theme
  const secondaryColor = [255, 140, 0]; // Orange
  const textColor = [0, 0, 0];
  const lightBg = [255, 248, 220]; // Light yellow background

  // Use temple image as-is without any overlay
  try {
    // Try to load the temple background image from local file
    const fs = await import('fs');
    const path = await import('path');
    const templeImagePath = path.join(process.cwd(), 'images', 'templesym.png');
    
    let templeImageDataUrl = null;
    
    // Try to read local image file first
    if (fs.existsSync(templeImagePath)) {
      const imageBuffer = fs.readFileSync(templeImagePath);
      templeImageDataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;
      console.log('Using local temple background image');
    } else {
      // Fallback to placeholder if local image not found
      const templeImageUrl = 'https://via.placeholder.com/595x842/8B4513/FFFFFF?text=Temple+Background';
      templeImageDataUrl = await fetchImageAsDataURL(templeImageUrl);
      console.log('Using placeholder temple background image');
    }
    
    if (templeImageDataUrl) {
      // Add temple background image directly without any overlay
      pdf.addImage(templeImageDataUrl, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    } else {
      // Fallback to clean background if image not found
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }
  } catch (error) {
    console.log('Temple background image not found, using clean design');
    // Simple white background
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  }

  // Header Section with temple theme
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 45, 'F');

  // Decorative temple elements in header
  pdf.setFillColor(255, 140, 0); // Orange accent
  pdf.rect(0, 0, pageWidth, 3, 'F'); // Top accent line
  
  // Hindu temple symbols
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ॐ', 20, 28); // Om symbol
  
  // Krishna temple symbol (flute representation)
  pdf.setFontSize(16);
  pdf.text('♫', pageWidth - 35, 26); // Musical note for flute
  pdf.setFontSize(12);
  pdf.text('Krishna', pageWidth - 40, 32);

  // Title with better styling
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('E-DARSHAN ENTRY PASS', pageWidth / 2, 28, { align: 'center' });

  // Subtitle
  pdf.setFontSize(11);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Sacred Temple Analytics Platform', pageWidth / 2, 38, { align: 'center' });

  let yPosition = 60;

  // Booking Details Section - text only, no background
  pdf.setTextColor(0, 0, 0); // Black text
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('BOOKING DETAILS', 20, yPosition);

  // Add decorative line under heading
  pdf.setDrawColor(0, 0, 0); // Black line
  pdf.setLineWidth(2);
  pdf.line(20, yPosition + 3, 80, yPosition + 3);

  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold'); // Bold text
  pdf.setTextColor(0, 0, 0); // Black text

  const details = [
    ['Booking ID:', bookingData?.id || 'N/A'],
    ['Temple:', bookingData?.temple?.name || 'N/A'],
    ['Location:', bookingData?.temple?.location || 'N/A'],
    ['Date:', bookingData?.date?.toLocaleDateString() || 'N/A'],
    ['Time Slot:', bookingData?.timeSlot || 'N/A'],
    ['Ticket Type:', bookingData?.ticketType || 'N/A'],
    ['Number of Tickets:', bookingData?.tickets?.toString() || 'N/A'],
    ['Total Amount:', `₹${bookingData?.amount || 'N/A'}`],
    ['Status:', bookingData?.status?.toUpperCase() || 'N/A']
  ];

  details.forEach(([label, value]) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.text(label, 20, yPosition);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.text(String(value || 'N/A'), 80, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Devotee Details Section - text only, no background
  if (bookingData?.devotees && bookingData?.devotees?.length > 0) {
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.text('DEVOTEE DETAILS', 20, yPosition);

    yPosition += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold'); // Bold text
    pdf.setTextColor(0, 0, 0); // Black text

    // Table header - no background, just text
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.text('Name', 25, yPosition);
    pdf.text('Age', 120, yPosition);

    yPosition += 10;

    // Devotee details
    bookingData?.devotees?.forEach((devotee, index) => {
      pdf.setFont('helvetica', 'bold'); // Bold text
      pdf.setTextColor(0, 0, 0); // Black text
      pdf.text(devotee?.name || 'N/A', 25, yPosition);
      pdf.text(devotee?.age ? devotee.age.toString() : 'N/A', 120, yPosition);
      yPosition += 8;

      // Add new page if needed
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 30;
      }
    });
  } else {
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Primary Devotee: ' + String(bookingData?.devoteeName || 'N/A'), 25, yPosition);
    yPosition += 8;
    pdf.text('Age: ' + String(bookingData?.age ? bookingData.age.toString() : 'N/A'), 25, yPosition);
  }

  yPosition += 15;

  // Important Instructions - text only, no background
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0, 0, 0); // Black text
  pdf.text('IMPORTANT INSTRUCTIONS', 20, yPosition);

  yPosition += 12;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold'); // Bold text
  pdf.setTextColor(0, 0, 0); // Black text

  const instructions = [
    '• Please arrive 30 minutes before your scheduled time',
    '• Carry a valid photo ID for verification',
    '• This ticket is non-transferable and valid only for the specified date and time',
    '• Photography may be restricted in certain areas',
    '• Follow temple guidelines and maintain decorum',
    '• In case of emergency, contact temple authorities immediately'
  ];

  instructions.forEach(instruction => {
    pdf.text(instruction, 20, yPosition);
    yPosition += 6;
  });

  // Generate QR code and place it in the right side area
  const qrData = JSON.stringify({
    bookingId: bookingData?.id,
    temple: bookingData?.temple?.name,
    date: bookingData?.date,
    timeSlot: bookingData?.timeSlot,
    ticketType: bookingData?.ticketType,
    tickets: bookingData?.tickets
  });

  try {
    console.log('Generating QR code for PDF with data:', qrData);
    
    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 3,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    console.log('QR code generated successfully, adding to PDF');

    // Position QR code in the right side area (where the blank space is)
    const qrSize = 50;
    const qrX = pageWidth - 80; // Right side positioning
    const qrY = 80; // Start after header

    // Draw QR code image directly on temple background (no white background)
    pdf.addImage(qrCodeDataURL, 'PNG', qrX, qrY, qrSize, qrSize);

    // Add "SCAN FOR ENTRY" label above QR code
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SCAN FOR ENTRY', qrX + qrSize/2, qrY - 10, { align: 'center' });

    // Add booking ID below QR code
    pdf.setTextColor(0, 0, 0); // Black text
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold'); // Bold text
    pdf.text(`ID: ${String(bookingData?.id || 'N/A')}`, qrX + qrSize/2, qrY + qrSize + 8, { align: 'center' });

    console.log('QR code added to PDF successfully at position:', qrX, qrY);

  } catch (error) {
    console.error('Error generating QR code for PDF:', error);
    
    // Fallback to text-based representation in right side
    const qrX = pageWidth - 80;
    const qrY = 80;
    const qrSize = 50;
    
    pdf.setFillColor(255, 255, 255);
    pdf.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4, 'F');
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('QR UNAVAILABLE', qrX + qrSize/2, qrY + 15, { align: 'center' });
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Use ID: ${String(bookingData?.id || 'N/A')}`, qrX + qrSize/2, qrY + 25, { align: 'center' });
  }

  // Continue with footer (removed duplicate scan instruction)

  // Footer
  const footerY = pageHeight - 30;
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, footerY, pageWidth, 30, 'F');

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Generated by Temple Analytics Platform', pageWidth / 2, footerY + 10, { align: 'center' });
  pdf.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 20, { align: 'center' });

  // Add temple contact info
  pdf.setFontSize(8);
  pdf.text(`Temple Contact: ${String(bookingData?.temple?.contact || 'N/A')}`, 20, footerY + 15);

  return pdf;
};

export default generateTicketPDF;