import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Download, Home, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import { getBooking, getApiUrl } from '../utils/api';

const PaymentSuccess = () => {
  const [sessionId, setSessionId] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    // Get session ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sid = urlParams.get('session_id');
    const tid = urlParams.get('ticket_id');
    setSessionId(sid || '');
    setTicketId(tid || '');

    if (tid) {
      getBooking(tid)
        .then((data) => {
          if (data) {
            setTicket(data);
          } else {
            // Fallback: confirm endpoint
            fetch(getApiUrl(`/payments/confirm?ticket_id=${tid}`))
              .then((r) => r.ok ? r.json() : null)
              .then((d) => d && setTicket(d))
              .catch(() => {});
          }
        })
        .catch(() => {
          fetch(getApiUrl(`/payments/confirm?ticket_id=${tid}`))
            .then((r) => r.ok ? r.json() : null)
            .then((d) => d && setTicket(d))
            .catch(() => {});
        });
    }
  }, []);

  const handleDownloadTicket = () => {
    if (ticket?._id) {
      // Navigate to booking confirmation management or trigger PDF later
      window.location.href = '/booking-confirmation-management?refresh=true';
    } else {
      window.location.href = '/booking-confirmation-management';
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-card rounded-lg sacred-shadow p-8 text-center"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="h-10 w-10 text-white" />
        </motion.div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-primary mb-4">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your e-darshan booking has been confirmed. You will receive a confirmation email shortly.
        </p>

        {/* Booking Details */}
        <div className="bg-muted rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-primary mb-2">Booking Details</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Booking ID:</span>
              <span className="font-mono">{ticket?._id || ticketId || sessionId || 'SW1049-' + Date.now().toString().slice(-6)}</span>
            </div>
            {!ticketId && (
              <div className="text-xs text-muted-foreground mt-2">
                Tip: If this page was opened without Stripe redirect, please return to the booking confirmation screen.
              </div>
            )}
            {ticket?.temple?.name && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Temple:</span>
                <span className="font-semibold">{ticket.temple.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <span className="text-success font-semibold">Confirmed</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleDownloadTicket}
            className="w-full sw1049-gradient text-white hover:opacity-90"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Ticket
          </Button>

          <Button
            variant="outline"
            onClick={handleGoHome}
            className="w-full border-temple-gold hover:bg-temple-gold/10"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Home
          </Button>
        </div>

        {/* Next Steps */}
        <div className="mt-8 p-4 bg-temple-gold/10 rounded-lg">
          <h4 className="font-semibold text-primary mb-2">What's Next?</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center">
              <ArrowRight className="h-3 w-3 mr-2 text-temple-gold" />
              <span>Check your email for booking confirmation</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-3 w-3 mr-2 text-temple-gold" />
              <span>Download your ticket for offline access</span>
            </div>
            <div className="flex items-center">
              <ArrowRight className="h-3 w-3 mr-2 text-temple-gold" />
              <span>Use the booking management page for updates</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
