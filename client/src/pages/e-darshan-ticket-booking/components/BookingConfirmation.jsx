import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Share2, Calendar, Clock, MapPin, Users, QrCode, Mail, MessageSquare } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { downloadTicketPDF } from '../../../utils/pdfGenerator.js';

export default function BookingConfirmation({ bookingData, ticket }) {
  const [showQR, setShowQR] = useState(false);
  const ticketRef = useRef(null);

  if (!ticket) return <p>Loading booking confirmation...</p>;

  const bookingId = ticket._id;
  const qrData = `${bookingId}|${bookingData.temple.id}|${bookingData.selectedDate?.toISOString()}|${bookingData.timeSlot}`;

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({ bookingId, ...bookingData }, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `e-darshan-ticket-${bookingId}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'E-Darshan Ticket Booked',
          text: `Successfully booked darshan at ${bookingData.temple.name} for ${bookingData.selectedDate?.toLocaleDateString()}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Sharing failed:', err);
      }
    } else {
      navigator.clipboard?.writeText(`E-Darshan Booking Confirmed! Booking ID: ${bookingId}`);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      console.log('Starting PDF download from BookingConfirmation');
      
      const pdfData = {
        id: bookingId || `TEMP-${Date.now()}`,
        temple: {
          name: bookingData?.temple?.name || ticket?.temple?.name || 'Temple',
          location: bookingData?.temple?.location || ticket?.temple?.location || 'Location',
          contact: bookingData?.temple?.contact || ticket?.temple?.contact || 'Contact',
          image: bookingData?.temple?.image || ticket?.temple?.image || bookingData?.temple?.preview
        },
        date: bookingData?.selectedDate ? new Date(bookingData.selectedDate) : new Date(),
        timeSlot: bookingData?.timeSlot || '10:00 AM',
        ticketType: bookingData?.ticketType || 'Regular Darshan',
        tickets: bookingData?.numberOfTickets || 1,
        amount: bookingData?.totalAmount || 0,
        status: 'confirmed',
        devotees: bookingData?.devoteeDetails ? [bookingData.devoteeDetails.primaryDevotee] : [{ name: 'Devotee', age: bookingData?.devoteeDetails?.primaryDevotee?.age }],
        devoteeName: bookingData?.devoteeDetails?.primaryDevotee?.name || 'Devotee',
        paymentStatus: 'paid'
      };
      
      console.log('Prepared PDF data:', pdfData);
      const success = await downloadTicketPDF(pdfData);
      
      if (!success) {
        alert('Failed to generate PDF. Please try again.');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      alert(`PDF download failed: ${error.message}`);
    }
  };

  const handleAddToCalendar = () => {
    const startDate = new Date(bookingData.selectedDate);
    const [hours, minutes] = (bookingData.timeSlot || '10:00').split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes));
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Darshan at ${bookingData.temple.name}`)}&dates=${startDate.toISOString().replace(/[-:]/g,'').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g,'').split('.')[0]}Z&details=${encodeURIComponent(`E-Darshan booking - ID: ${bookingId}`)}&location=${encodeURIComponent(bookingData.temple.location)}`;
    window.open(calendarUrl, '_blank');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">

      {/* Success Header */}
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 25 }} className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-white" />
        </motion.div>
        <h2 className="text-3xl font-bold text-success mb-2">Booking Confirmed!</h2>
        <p className="text-muted-foreground mb-4">Your e-darshan tickets have been successfully booked</p>
        <div className="inline-flex items-center space-x-2 bg-success/10 text-success rounded-full px-6 py-3">
          <span className="text-lg font-bold">🎫</span>
          <span className="font-bold">Booking ID: {bookingId}</span>
        </div>
      </div>

      {/* Digital Ticket */}
      <motion.div ref={ticketRef} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-temple-saffron/10 via-white to-temple-gold/10 rounded-2xl p-8 sacred-shadow-lg border-2 border-temple-gold/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-temple-gold/20 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-temple-saffron/20 rounded-full translate-y-12 -translate-x-12" />

        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-1">E-Darshan Ticket</h3>
              <p className="text-temple-gold font-semibold">Team SW1049 • Digital Pass</p>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowQR(!showQR)} className="bg-temple-gold/20 rounded-lg p-3">
              <QrCode className="h-6 w-6 text-temple-gold" />
            </motion.button>
          </div>

          {showQR && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 bg-white/98 rounded-2xl flex items-center justify-center z-20 shadow-2xl" onClick={() => setShowQR(false)}>
              <div className="text-center p-6">
                {ticket?.qrCode ? (
                  <img src={ticket.qrCode} alt="Ticket QR Code" className="w-56 h-56 rounded-lg mb-4 object-contain mx-auto border-2 border-gray-200" />
                ) : (
                  <div className="w-56 h-56 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border-2 border-gray-200">
                    <div className="text-gray-600 text-sm">QR Code Generating...</div>
                  </div>
                )}
                <p className="text-base font-medium text-gray-800 mb-2">Scan at temple entrance</p>
                <p className="text-sm text-gray-500">Tap anywhere to close</p>
              </div>
            </motion.div>
          )}

          {/* Booking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-temple-saffron mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Temple</p>
                  <p className="font-bold text-primary">{bookingData.temple.name}</p>
                  <p className="text-xs text-muted-foreground">{bookingData.temple.location}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-temple-gold mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-bold text-primary">{bookingData.selectedDate?.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-temple-red mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Time Slot</p>
                  <p className="font-bold text-primary">{bookingData.timeSlot}</p>
                  <p className="text-xs text-temple-green">Report 15 minutes early</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="h-5 w-5 text-sw1049-primary mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Tickets</p>
                  <p className="font-bold text-primary">{bookingData.numberOfTickets} × {bookingData.ticketType}</p>
                  <p className="text-xs text-muted-foreground">Primary: {bookingData.devoteeDetails?.primaryDevotee?.name}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-temple-gold/10 rounded-lg p-4 border border-temple-gold/30">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Amount Paid</span>
              <span className="text-2xl font-bold text-temple-saffron">₹{bookingData.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Button onClick={handleDownloadPDF} className="flex items-center justify-center space-x-2 bg-temple-gold hover:bg-temple-gold/90 text-white">
          <Download className="h-4 w-4" /><span>Download PDF</span>
        </Button>
        <Button onClick={handleDownload} className="flex items-center justify-center space-x-2 bg-temple-green hover:bg-temple-green/90 text-white">
          <Download className="h-4 w-4" /><span>Download</span>
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex items-center justify-center space-x-2 border-temple-gold hover:bg-temple-gold/10">
          <Share2 className="h-4 w-4" /><span>Share</span>
        </Button>
        <Button onClick={handleAddToCalendar} variant="outline" className="flex items-center justify-center space-x-2 border-temple-saffron hover:bg-temple-saffron/10">
          <Calendar className="h-4 w-4" /><span>Add to Calendar</span>
        </Button>
        <Button onClick={() => window.location.href='/booking-confirmation-management'} className="flex items-center justify-center space-x-2 sw1049-gradient text-white hover:opacity-90">
          <Users className="h-4 w-4" /><span>Manage Booking</span>
        </Button>
      </motion.div>

      {/* Email Confirmation Notice */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-temple-gold/10 border border-temple-gold/30 rounded-lg p-6">
        <h4 className="font-semibold text-temple-gold mb-3">📧 Email Confirmation</h4>
        <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 text-success">
            <Mail className="h-5 w-5" />
            <span className="font-semibold">Confirmation Email Sent!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            A detailed booking confirmation has been sent to <strong>{bookingData.devoteeDetails?.primaryDevotee?.email}</strong>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Please check your inbox and spam folder. The email contains your digital ticket and QR code.
          </p>
        </div>
        
        <h4 className="font-semibold text-temple-gold mb-3">📋 Important Information</h4>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Keep the confirmation email as your digital ticket</li>
          <li>• All devotees must carry valid photo ID</li>
          <li>• Names must match exactly with ID</li>
          <li>• Children below 12 years are eligible for discounts</li>
          <li>• Phone number used for OTP verification at entry</li>
        </ul>
      </motion.div>

    </motion.div>
  );
}
