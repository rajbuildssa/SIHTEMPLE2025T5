# QR Code Testing Guide

## Overview
This guide helps you test the QR code generation functionality for the Temple Analytics E-Darshan ticket system.

## Quick Test
1. Open `qr-test.html` in your browser
2. Click "Generate Test QR Code" to test QR code creation
3. Click "Generate Test PDF" to test PDF generation with QR code
4. Check browser console (F12) for detailed logs

## Files Created
- `qr-test.html` - Standalone test page
- `src/utils/qrTest.js` - QR code testing utility
- `src/pages/qr-test/index.jsx` - React component for QR testing

## Testing Steps

### 1. QR Code Generation Test
- Tests the `qrcode` library integration
- Generates a QR code with sample booking data
- Displays the QR code and data for verification
- Shows success/failure status

### 2. PDF Generation Test
- Tests the complete PDF generation pipeline
- Creates a sample PDF with embedded QR code
- Downloads the PDF to your browser's download folder
- Verifies the entire ticket generation process

### 3. Manual Testing
- Use a QR code scanner app on your phone
- Scan the generated QR code
- Verify the encoded data matches the expected format
- Check if the PDF displays correctly

## Expected Results
- ✅ QR code should generate successfully
- ✅ QR code should be scannable and contain correct data
- ✅ PDF should download with embedded QR code
- ✅ QR code in PDF should be scannable

## Troubleshooting
- If QR generation fails, check browser console for errors
- Ensure all dependencies are properly installed
- Check network connectivity for external libraries
- Verify the `qrcode` library is correctly imported

## Sample Data Used
```json
{
  "bookingId": "TEST123456",
  "temple": "Test Temple",
  "date": "2025-01-15",
  "timeSlot": "10:00 AM",
  "ticketType": "VIP Darshan",
  "tickets": 2
}
```

## Next Steps
1. Run the tests to verify QR code functionality
2. Fix any issues found during testing
3. Integrate QR testing into the main application
4. Add QR code to booking confirmation workflow
