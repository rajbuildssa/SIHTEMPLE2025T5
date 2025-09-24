import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, QrCode, MapPin, Clock, Users, IndianRupee, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { downloadTicketPDF } from '../../../utils/pdfGenerator';
import QRCode from 'qrcode';

const TicketManagementCard = ({ bookingData, onDownload, onShare, onModify }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);
  const [qrCodeDataURL, setQrCodeDataURL] = useState(null);

  const toBase64Unicode = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch {
      return btoa(str);
    }
  };

  const buildStaticTicketHTML = () => {
    const allowed = (bookingData?.paymentStatus || '').toLowerCase() === 'paid';
    const bg = bookingData?.temple?.image || bookingData?.temple?.preview || '';
    return `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Ticket ${bookingData?.id}</title>
    <style>body{margin:0;background:#f6f2ea;font-family:system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial} .card{max-width:420px;margin:0 auto;padding:16px}
    .box{border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.12);background:#fff}
    .hdr{height:160px;color:#fff;background-image:linear-gradient(rgba(0,0,0,.5),rgba(0,0,0,.5)),url('${bg}');background-size:cover;background-position:center;display:flex;align-items:center;justify-content:space-between;padding:16px}
    .mono{font-family:monospace;font-weight:700}
    .name{font-size:20px;font-weight:700;margin:12px 0 6px}
    .chip{display:inline-block;padding:4px 10px;border-radius:999px;font-size:12px;font-weight:600;border:1px solid ${allowed ? 'rgba(16,185,129,.35)' : 'rgba(245,158,11,.35)'};color:${allowed ? '#0a7d32' : '#b45309'};background:${allowed ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)'} }
    .row{padding:0 16px 16px}
    .meta{color:#555;font-size:14px;line-height:1.6}
    </style></head><body><div class=card><div class=box>
    <div class=hdr><div><div style="font-weight:700;font-size:18px">E‑Darshan Ticket</div><div style="opacity:.8">Booking Confirmation</div></div><div class=mono>${bookingData?.id}</div></div>
    <div class=row>
      <div class=name>${bookingData?.devoteeName || 'Devotee'}</div>
      <div class=chip>${allowed ? 'ALLOWED' : 'NOT ALLOWED'}</div>
      <div class=meta style="margin-top:12px">
        <div><b>Temple:</b> ${bookingData?.temple?.name || ''}</div>
        <div><b>Date:</b> ${new Date(bookingData?.date || Date.now()).toLocaleDateString()}</div>
        <div><b>Time:</b> ${bookingData?.timeSlot || ''}</div>
        <div><b>Tickets:</b> ${bookingData?.tickets || 1} (${bookingData?.ticketType || ''})</div>
        <div><b>Amount:</b> ₹${bookingData?.amount || 0}</div>
      </div>
    </div>
    </div></div></body></html>`;
  };

  // Generate QR code when component mounts (only once for mock data)
  useEffect(() => {
    const generateQRCode = async () => {
      if (!bookingData?.id) return;

      try {
        // Use simple JSON data like the server does
        const qrData = JSON.stringify({
          id: bookingData.id,
          status: bookingData.paymentStatus,
          name: bookingData.devoteeName,
          temple: bookingData.temple?.name
        });

        const qrCodeURL = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrCodeDataURL(qrCodeURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRCode();
  }, []); // Empty dependency array - generate only once on mount

  const handlePDFDownload = async () => {
    setIsDownloading(true);
    setDownloadStatus('processing');

    try {
      console.log('Starting PDF download for booking:', bookingData);
      
      // Ensure we have valid booking data
      if (!bookingData) {
        throw new Error('No booking data available');
      }

      // Prepare booking data for PDF generation
      const pdfBookingData = {
        id: bookingData.id || `TEMP-${Date.now()}`,
        temple: {
          name: bookingData.temple?.name || 'Temple',
          location: bookingData.temple?.location || 'Location',
          contact: bookingData.temple?.contact || 'Contact',
          image: bookingData.temple?.image || bookingData.temple?.preview
        },
        date: bookingData.date ? new Date(bookingData.date) : new Date(),
        timeSlot: bookingData.timeSlot || '10:00 AM',
        ticketType: bookingData.ticketType || 'Regular Darshan',
        tickets: bookingData.tickets || 1,
        amount: bookingData.amount || 0,
        status: bookingData.status || 'confirmed',
        devotees: bookingData.devotees || [{ name: bookingData.devoteeName || 'Devotee', age: 30 }],
        devoteeName: bookingData.devoteeName || 'Devotee',
        paymentStatus: bookingData.paymentStatus || 'paid'
      };

      console.log('Prepared booking data for PDF:', pdfBookingData);

      const success = await downloadTicketPDF(pdfBookingData);
      if (success) {
        setDownloadStatus('success');
        setTimeout(() => setDownloadStatus(null), 3000);
      } else {
        setDownloadStatus('error');
        setTimeout(() => setDownloadStatus(null), 3000);
      }
    } catch (error) {
      console.error('Download failed:', error);
      setDownloadStatus('error');
      setTimeout(() => setDownloadStatus(null), 3000);
      alert(`PDF download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeSlot) => {
    if (!timeSlot) return 'N/A';
    return timeSlot;
  };

  const formatINR = (amount) => {
    if (amount == null) return '₹0';
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(amount));
    } catch {
      return `₹${amount}`;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'text-success bg-success/10 border-success';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning';
      case 'cancelled':
        return 'text-error bg-error/10 border-error';
      default:
        return 'text-muted-foreground bg-muted/10 border-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl sacred-shadow-lg border border-border overflow-hidden"
    >
      {/* Header with temple background */}
      <div
        className="p-6 text-white relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.6)), url(${bookingData?.temple?.image || bookingData?.temple?.preview || ''})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          imageRendering: 'crisp-edges',
          WebkitImageRendering: 'crisp-edges'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold">E-Darshan Ticket</h2>
              <p className="text-white/80 text-sm">Booking Confirmation</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">{bookingData?.id}</div>
            <div className="text-white/80 text-sm">Booking ID</div>
          </div>
        </div>
      </div>

      {/* Primary ticket details with QR moved to the right on desktop */}
      <div className="p-6 border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2 space-y-2">
            <div className="text-sm text-white/80">Devotee Name</div>
            <div className="text-2xl font-semibold">{bookingData?.devoteeName || 'Devotee'}</div>
          </div>

          <div className="flex md:justify-end justify-center">
            {qrCodeDataURL ? (
              <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-primary/20">
                <img
                  src={qrCodeDataURL}
                  alt="QR Code"
                  className="w-36 h-36 md:w-40 md:h-40"
                />
                <p className="text-xs text-center text-muted-foreground mt-2">Scan for entry</p>
              </div>
            ) : (
              <div className="w-36 h-36 md:w-40 md:h-40 bg-muted flex items-center justify-center text-muted-foreground rounded-lg border-2 border-dashed border-muted-foreground/30">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <div className="text-xs">Generating QR...</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(bookingData?.status)}`}>
            {getStatusIcon(bookingData?.status)}
            <span className="text-sm font-medium capitalize">{bookingData?.status}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Booked on {new Date(bookingData?.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Temple Information */}
        <div className="bg-surface rounded-lg p-4 space-y-3">
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">{bookingData?.temple?.name}</h3>
              <p className="text-muted-foreground">{bookingData?.temple?.location}</p>
              <p className="text-sm text-muted-foreground">{bookingData?.temple?.contact}</p>
            </div>
          </div>
        </div>

        {/* Visit Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Visit Date & Time</span>
            </div>
            <div className="text-lg font-semibold">{formatDate(bookingData?.date)}</div>
            <div className="text-primary font-medium">{formatTime(bookingData?.timeSlot)}</div>
          </div>

          <div className="bg-surface rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Devotees</span>
            </div>
            <div className="text-lg font-semibold">{bookingData?.tickets} Person(s)</div>
            <div className="text-sm text-muted-foreground">{bookingData?.ticketType}</div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-surface rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IndianRupee className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Total Amount</span>
            </div>
            <div className="text-xl font-bold text-primary">{formatINR(bookingData?.amount)}</div>
          </div>
          <div className="mt-2 text-sm text-success font-medium">
            ✓ {bookingData?.paymentStatus?.toUpperCase()}
          </div>
        </div>

        {/* Devotee List */}
        {bookingData?.devotees && bookingData?.devotees?.length > 0 && (
          <div className="bg-surface rounded-lg p-4">
            <h4 className="font-medium mb-3">Devotee Details</h4>
            <div className="space-y-2">
              {bookingData?.devotees?.map((devotee, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <span className="font-medium">{devotee?.name}</span>
                  <span className="text-sm text-muted-foreground">Age: {devotee?.age}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            onClick={handlePDFDownload}
            disabled={isDownloading}
            className="flex-1 flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90"
          >
            {isDownloading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span>
              {isDownloading
                ? 'Generating PDF...'
                : downloadStatus === 'success'
                  ? 'PDF Downloaded!'
                  : downloadStatus === 'error'
                    ? 'Download Failed'
                    : 'Download PDF Ticket'
              }
            </span>
          </Button>

          <Button
            variant="outline"
            onClick={onShare}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Booking</span>
          </Button>

          <Button
            variant="outline"
            onClick={onModify}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <QrCode className="h-4 w-4" />
            <span>Modify</span>
          </Button>
        </div>

        {/* Important Notes */}
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-warning mb-1">Important Notes:</p>
              <ul className="text-warning/80 space-y-1">
                <li>• Please arrive 30 minutes before your scheduled time</li>
                <li>• Carry a valid photo ID for verification</li>
                <li>• This ticket is valid only for the specified date and time</li>
                <li>• Follow temple guidelines and maintain decorum</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TicketManagementCard;
