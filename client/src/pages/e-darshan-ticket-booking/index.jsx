import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Users, CreditCard, CheckCircle } from 'lucide-react';
import BookingHeader from './components/BookingHeader';
import TempleSelector from './components/TempleSelector';
import DarshanBookingForm from './components/DarshanBookingForm';
import TicketSelection from './components/TicketSelection';
import DevoteeDetailsForm from './components/DevoteeDetailsForm';
import PaymentIntegration from './components/PaymentIntegration';
import BookingConfirmation from './components/BookingConfirmation';
import { fetchTemples } from '../../utils/api';
import { useAuth } from '@clerk/clerk-react';

const EDarshanTicketBooking = () => {
  const { getToken } = useAuth();

  const [bookingStep, setBookingStep] = useState(1);
  const [temples, setTemples] = useState([]);
  const [bookingData, setBookingData] = useState({
    temple: null,
    selectedDate: new Date(),
    timeSlot: null,
    ticketType: null,
    numberOfTickets: 1,
    devoteeDetails: {},
    paymentMethod: 'upi',
    totalAmount: 0,
  });
  const [ticket, setTicket] = useState(null);

  const steps = [
    { id: 1, title: 'Select Temple', icon: MapPin },
    { id: 2, title: 'Choose Date & Time', icon: Calendar },
    { id: 3, title: 'Select Tickets', icon: Users },
    { id: 4, title: 'Devotee Details', icon: Users },
    { id: 5, title: 'Payment', icon: CreditCard },
    { id: 6, title: 'Confirmation', icon: CheckCircle },
  ];

  // Load temples from backend
  useEffect(() => {
    const loadTemples = async () => {
      try {
        const data = await fetchTemples();
        setTemples(data);
      } catch (err) {
        console.error('Failed to load temples', err);
      }
    };
    loadTemples();
  }, []);

  // Calculate total amount
  useEffect(() => {
    if (bookingData.temple && bookingData.ticketType && bookingData.numberOfTickets) {
      const basePrice = bookingData.temple.ticketPrices[bookingData.ticketType] || 0;
      setBookingData(prev => ({ ...prev, totalAmount: basePrice * bookingData.numberOfTickets }));
    }
  }, [bookingData.temple, bookingData.ticketType, bookingData.numberOfTickets]);

  const handleStepData = async (step, data) => {
    setBookingData(prev => ({ ...prev, ...data }));

    setBookingStep(step);
  };

  const handlePreviousStep = () => {
    if (bookingStep > 1) setBookingStep(bookingStep - 1);
  };

  const renderStepContent = () => {
    switch (bookingStep) {
      case 1:
        return (
          <TempleSelector
            temples={temples}
            selectedTemple={bookingData.temple}
            onSelect={(temple) => handleStepData(2, { temple })}
          />
        );
      case 2:
  // Generate dummy slots for the selected temple
  const temple = bookingData.temple;
  let availableSlots = [];
  if (temple) {
    const openHour = parseInt(temple.openTime.split(':')[0]);
    const closeHour = parseInt(temple.closeTime.split(':')[0]);
    for (let hour = openHour; hour < closeHour; hour += 2) {
      const availability = Math.floor(Math.random() * 100) + 50; // 50-150 slots
      const crowdLevel =
        availability > 120 ? 'low' : availability > 80 ? 'medium' : 'high';
      availableSlots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: availability,
        total: temple.capacity,
        crowdLevel,
        waitTime: crowdLevel === 'high' ? 45 : crowdLevel === 'medium' ? 25 : 10,
      });
    }
  }

  return (
    <DarshanBookingForm
      selectedTemple={temple}
      selectedDate={bookingData.selectedDate}
      selectedTimeSlot={bookingData.timeSlot}
      availableSlots={availableSlots} // ✅ Pass the slots here
      onDateChange={(selectedDate) =>
        setBookingData((prev) => ({ ...prev, selectedDate }))
      }
      onTimeSlotSelect={(timeSlot) => handleStepData(3, { timeSlot })}
    />
  )
      case 3:
        return (
          <TicketSelection
            temple={bookingData.temple}
            ticketType={bookingData.ticketType}
            numberOfTickets={bookingData.numberOfTickets}
            onTicketTypeChange={(ticketType) => setBookingData(prev => ({ ...prev, ticketType }))}
            onQuantityChange={(numberOfTickets) => setBookingData(prev => ({ ...prev, numberOfTickets }))}
            onNext={() => handleStepData(4, {})}
          />
        );
      case 4:
        return (
          <DevoteeDetailsForm
            numberOfTickets={bookingData.numberOfTickets}
            devoteeDetails={bookingData.devoteeDetails}
            onDetailsSubmit={(devoteeDetails) => handleStepData(5, { devoteeDetails })}
          />
        );
      case 5:
        return (
          <PaymentIntegration
            bookingData={bookingData}
            onPaymentComplete={(createdTicket) => { if (createdTicket) setTicket(createdTicket); handleStepData(6, {}); }}
          />
        );
      case 6:
        return (
          <BookingConfirmation
            bookingData={bookingData}
            ticket={ticket}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-muted">
      <BookingHeader teamId="SW1049" />
      <div className="container mx-auto px-4 py-8">
        {/* Step Progress */}
        <div className="mb-8 flex justify-between items-center">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const isActive = step.id === bookingStep;
            const isCompleted = step.id < bookingStep;
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--color-muted)'
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-success text-white' : isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-5 w-5" /> : <IconComponent className="h-5 w-5" />}
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:block w-16 h-0.5 mx-2 ${step.id < bookingStep ? 'bg-success' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={bookingStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {bookingStep > 1 && bookingStep < 6 && (
          <div className="flex justify-center mt-8">
            <button onClick={handlePreviousStep} className="px-4 py-2 border rounded hover:bg-gray-100">
              Previous Step
            </button>
          </div>
        )}

        {/* Booking Summary */}
        {bookingStep > 1 && bookingStep < 6 && bookingData.temple && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-4 right-4 bg-card rounded-lg p-4 shadow max-w-sm"
          >
            <h4 className="font-semibold text-primary mb-2">Booking Summary</h4>
            <div className="space-y-1 text-sm">
              <div>Temple: {bookingData.temple.name}</div>
              {bookingData.selectedDate && <div>Date: {bookingData.selectedDate.toLocaleDateString()}</div>}
              {bookingData.timeSlot && <div>Time: {bookingData.timeSlot}</div>}
              {bookingData.numberOfTickets > 0 && <div>Tickets: {bookingData.numberOfTickets} × {bookingData.ticketType}</div>}
              {bookingData.totalAmount > 0 && <div className="font-semibold text-temple-saffron">Total: ₹{bookingData.totalAmount}</div>}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EDarshanTicketBooking;
