import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, QrCode, Download, CheckCircle, XCircle } from 'lucide-react';
import Button from '../../components/ui/Button';

const QRTestPage = () => {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQRTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Import the QR test utility
      const { testQRCodeGeneration } = await import('../../utils/qrTestFixed');
      const result = await testQRCodeGeneration();

      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'Test execution failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePDFTest = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Test PDF generation with QR code
      const { downloadTicketPDF } = await import('../../utils/pdfGenerator');

      const testBookingData = {
        id: 'TEST123456',
        temple: {
          name: 'Test Temple',
          location: 'Test City, Test State',
          contact: '+91-9999-999999'
        },
        date: new Date(),
        timeSlot: '10:00 AM',
        tickets: 2,
        ticketType: 'Regular Darshan',
        amount: 200,
        status: 'confirmed',
        devotees: [
          { name: 'Test User', age: 30 }
        ]
      };

      const success = await downloadTicketPDF(testBookingData);

      setTestResult({
        success,
        message: success ? 'PDF generated successfully with QR code!' : 'PDF generation failed'
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: 'PDF test failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Booking
          </Button>

          <div className="bg-card rounded-lg sacred-shadow p-6">
            <div className="flex items-center space-x-3 mb-4">
              <QrCode className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-primary">QR Code Test Page</h1>
                <p className="text-muted-foreground">
                  Test QR code generation functionality for E-Darshan tickets
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Test Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg sacred-shadow p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-4">Test Options</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={handleQRTest}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 h-auto py-4"
            >
              <QrCode className="h-5 w-5" />
              <span>Test QR Code Generation</span>
            </Button>

            <Button
              variant="outline"
              onClick={handlePDFTest}
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 h-auto py-4"
            >
              <Download className="h-5 w-5" />
              <span>Test PDF with QR Code</span>
            </Button>
          </div>
        </motion.div>

        {/* Test Results */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`rounded-lg sacred-shadow p-6 ${
              testResult.success
                ? 'bg-success/10 border border-success/20'
                : 'bg-destructive/10 border border-destructive/20'
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              {testResult.success ? (
                <CheckCircle className="h-6 w-6 text-success" />
              ) : (
                <XCircle className="h-6 w-6 text-destructive" />
              )}
              <h3 className={`font-semibold ${
                testResult.success ? 'text-success' : 'text-destructive'
              }`}>
                {testResult.success ? 'Test Passed' : 'Test Failed'}
              </h3>
            </div>

            <p className="text-sm mb-3">{testResult.message}</p>

            {testResult.qrCodeDataURL && (
              <div className="mb-3">
                <p className="text-xs font-mono text-muted-foreground mb-2">
                  QR Code Data URL Length: {testResult.qrCodeDataURL.length} characters
                </p>
                <div className="bg-muted/50 p-3 rounded text-xs font-mono overflow-x-auto">
                  {testResult.qrCodeDataURL.substring(0, 100)}...
                </div>
              </div>
            )}

            {testResult.error && (
              <div className="bg-muted/50 p-3 rounded text-xs">
                <p className="font-semibold text-destructive mb-1">Error Details:</p>
                <p className="font-mono">{testResult.error}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg sacred-shadow p-6"
        >
          <h3 className="font-semibold mb-3">How to Test:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Click "Test QR Code Generation" to verify QR code creation works</li>
            <li>• Click "Test PDF with QR Code" to generate a test PDF with QR code</li>
            <li>• Check browser console (F12) for detailed logs during testing</li>
            <li>• Look for downloaded PDF files in your browser's download folder</li>
            <li>• Use a QR code scanner app to verify the generated QR codes are scannable</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default QRTestPage;
