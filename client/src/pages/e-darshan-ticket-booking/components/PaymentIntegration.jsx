import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@clerk/clerk-react';
import { createTicket } from '../../../utils/api';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

// Initialize Stripe (replace with your publishable key)
const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
  : null;

const PaymentIntegration = ({ bookingData, onPaymentMethodSelect, onPaymentComplete }) => {
  const [paymentStep, setPaymentStep] = useState('method'); // method, processing, success
  const [isProcessing, setIsProcessing] = useState(false);
  const { getToken } = useAuth();

  const handleStripePayment = async () => {
    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      if (!stripePromise) {
        throw new Error('Stripe is not configured');
      }
      const stripe = await stripePromise;
      await getToken();

      // Build tickets object based on selection
      const tickets = {
        regular: bookingData.ticketType === 'regular' ? bookingData.numberOfTickets : 0,
        vip: bookingData.ticketType === 'vip' ? bookingData.numberOfTickets : 0,
        senior: bookingData.ticketType === 'senior' ? bookingData.numberOfTickets : 0,
      };

      const checkoutUrl = await createTicket(
        bookingData.temple?.id || bookingData.temple?._id,
        bookingData.devoteeDetails,
        tickets
      );

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (error) {
      console.error('Payment error:', error?.message || error);
      setPaymentStep('method');
      setIsProcessing(false);
      alert(`Payment failed: ${error?.message || 'Please try again.'}`);
    }
  };

  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stripe Card Payment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ y: -2 }}
          className="relative border-2 border-temple-gold rounded-lg p-6 cursor-pointer transition-sacred bg-temple-gold/10"
          onClick={() => onPaymentMethodSelect('stripe')}
        >
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-temple-green text-white text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</span>
          </div>
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-temple-gold/20 flex items-center justify-center mr-3">
              <CreditCard className="h-5 w-5 text-temple-gold" />
            </div>
            <h4 className="font-bold text-primary">Secure Card Payment</h4>
          </div>
          <p className="text-sm text-muted-foreground">Pay securely with Visa, Mastercard, UPI</p>
        </motion.div>

        {/* UPI Payment */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -2 }}
          className="relative border-2 border-border rounded-lg p-6 cursor-pointer transition-sacred hover:border-temple-gold hover:bg-temple-gold/5"
          onClick={() => onPaymentMethodSelect('upi')}
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-lg bg-temple-green/20 flex items-center justify-center mr-3">
              <span className="text-2xl">📱</span>
            </div>
            <h4 className="font-bold text-primary">UPI Payment</h4>
          </div>
          <p className="text-sm text-muted-foreground">Google Pay, PhonePe, Paytm, BHIM</p>
        </motion.div>
      </div>

      <Button
        onClick={() => setPaymentStep('details')}
        disabled={!bookingData?.paymentMethod}
        size="lg"
        className="w-full sw1049-gradient text-white hover:opacity-90"
      >
        Continue to Payment
      </Button>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center space-x-3 bg-muted rounded-full px-6 py-3 mb-4">
          <CreditCard className="h-5 w-5 text-temple-gold" />
          <span className="font-semibold">Secure Payment</span>
        </div>
      </div>

      <div className="bg-card rounded-lg sacred-shadow p-6 text-center">
        <div className="w-16 h-16 mx-auto bg-temple-gold/20 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-8 w-8 text-temple-gold" />
        </div>
        <h3 className="text-xl font-bold text-primary mb-2">Stripe Secure Checkout</h3>
        <p className="text-muted-foreground mb-6">
          You'll be redirected to Stripe's secure payment page to complete your transaction.
        </p>

        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">₹{bookingData.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button
            variant="outline"
            onClick={() => setPaymentStep('method')}
            className="flex-1 border-temple-gold hover:bg-temple-gold/10"
          >
            Back
          </Button>
          <Button
            onClick={handleStripePayment}
            disabled={isProcessing}
            className="flex-1 sw1049-gradient text-white hover:opacity-90"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay ₹${bookingData.totalAmount.toLocaleString()}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-16 h-16 border-4 border-temple-gold border-t-transparent rounded-full mx-auto"
      />
      <h3 className="text-xl font-bold text-primary">Redirecting to Payment</h3>
      <p className="text-muted-foreground">Please wait while we redirect you to Stripe...</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto"
      >
        <CheckCircle className="h-10 w-10 text-white" />
      </motion.div>
      <h3 className="text-2xl font-bold text-success">Payment Successful!</h3>
      <p className="text-muted-foreground">Your e-darshan booking is confirmed.</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">
          {paymentStep === 'success' ? 'Payment Complete' : 'Secure Payment'}
        </h2>
        <p className="text-muted-foreground mb-4">
          {paymentStep === 'method' && 'Choose your preferred payment method'}
          {paymentStep === 'details' && 'Complete your secure payment'}
          {paymentStep === 'processing' && 'Processing your payment'}
          {paymentStep === 'success' && 'Your booking has been confirmed'}
        </p>
        {paymentStep !== 'success' && (
          <div className="inline-flex items-center space-x-2 bg-success/10 text-success rounded-full px-4 py-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-semibold">256-bit SSL Secured</span>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg sacred-shadow p-6">
        {paymentStep === 'method' && renderMethodSelection()}
        {paymentStep === 'details' && renderPaymentDetails()}
        {paymentStep === 'processing' && renderProcessing()}
        {paymentStep === 'success' && renderSuccess()}
      </div>
    </motion.div>
  );
};

export default PaymentIntegration;
