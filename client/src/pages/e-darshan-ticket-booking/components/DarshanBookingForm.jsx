import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../../../components/ui/Button';
import { format, addDays, isSameDay, isToday, isTomorrow } from 'date-fns';

const DarshanBookingForm = ({ 
  selectedTemple, 
  selectedDate, 
  selectedTimeSlot, 
  availableSlots, 
  onDateChange, 
  onTimeSlotSelect, 
  onNextStep // new prop to proceed to ticket selection
}) => {
  const [selectedWeek, setSelectedWeek] = useState(0);
  const [slots, setSlots] = useState([]);

  // Generate next 14 dates
  const generateDates = () => Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));
  const dates = generateDates();
  const weekDates = dates.slice(selectedWeek * 7, (selectedWeek + 1) * 7);

  useEffect(() => {
    if (availableSlots && availableSlots.length > 0) {
      setSlots(availableSlots);
    }
  }, [availableSlots]);

  const getCrowdLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-temple-green bg-temple-green/20';
      case 'medium': return 'text-temple-gold bg-temple-gold/20';
      case 'high': return 'text-error bg-error/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getCrowdLevelText = (level) => {
    switch (level) {
      case 'low': return 'Light Crowd';
      case 'medium': return 'Moderate';
      case 'high': return 'Heavy Crowd';
      default: return 'Unknown';
    }
  };

  const getDateLabel = (date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Select Date & Time</h2>
        <p className="text-muted-foreground mb-4">Choose your preferred darshan date and time slot</p>
        {selectedTemple && (
          <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
            <span className="text-temple-saffron">🏛️</span>
            <span className="font-semibold">{selectedTemple.name}</span>
          </div>
        )}
      </div>

      {/* Date Selection */}
      <div className="bg-card rounded-lg sacred-shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2 h-5 w-5 text-temple-gold" />
          Select Date
        </h3>

        <div className="flex justify-between items-center mb-4">
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(Math.max(0, selectedWeek - 1))}
            disabled={selectedWeek === 0}
            className="border-temple-gold hover:bg-temple-gold/10"
          >
            Previous Week
          </Button>
          <span className="text-sm text-muted-foreground">
            {format(weekDates[0], 'MMM d')} - {format(weekDates[weekDates.length - 1], 'MMM d, yyyy')}
          </span>
          <Button
            variant="outline"
            onClick={() => setSelectedWeek(selectedWeek + 1)}
            disabled={selectedWeek >= 1}
            className="border-temple-gold hover:bg-temple-gold/10"
          >
            Next Week
          </Button>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isSelected = isSameDay(date, selectedDate);
            const isPast = date < new Date() && !isToday(date);
            return (
              <motion.button
                key={index}
                whileHover={!isPast ? { scale: 1.05 } : {}}
                whileTap={!isPast ? { scale: 0.95 } : {}}
                onClick={() => !isPast && onDateChange(date)}
                disabled={isPast}
                className={`p-3 rounded-lg text-center transition-sacred ${
                  isPast
                    ? 'bg-muted/50 text-muted-foreground cursor-not-allowed opacity-50'
                    : isSelected
                    ? 'sw1049-gradient text-white'
                    : 'bg-muted hover:bg-temple-gold/20 hover:border-temple-gold'
                }`}
              >
                <div className="text-xs font-medium">{getDateLabel(date)}</div>
                <div className="text-lg font-bold">{format(date, 'd')}</div>
                <div className="text-xs">{format(date, 'MMM')}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slot Selection */}
      {selectedDate && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-lg sacred-shadow p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-temple-saffron" />
            Available Time Slots
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({format(selectedDate, 'EEEE, MMMM d, yyyy')})
            </span>
          </h3>

          {slots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {slots.map((slot, index) => {
                const isSelected = selectedTimeSlot === slot.time;
                const isAvailable = slot.available > 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={isAvailable ? { y: -2 } : {}}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-sacred ${
                      !isAvailable
                        ? 'border-muted bg-muted/50 opacity-50 cursor-not-allowed'
                        : isSelected
                        ? 'border-sw1049-primary bg-sw1049-primary/10'
                        : 'border-border hover:border-temple-gold hover:bg-temple-gold/5'
                    }`}
                    onClick={() => isAvailable && onTimeSlotSelect(slot.time)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-lg font-bold text-primary">{slot.time}</p>
                        <p className="text-sm text-muted-foreground">
                          {isAvailable ? `${slot.available}/${slot.total} slots` : 'Fully Booked'}
                        </p>
                      </div>
                      {isSelected && <CheckCircle className="h-5 w-5 text-success" />}
                    </div>

                    {/* Crowd Level */}
                    <div className="flex items-center justify-between">
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${getCrowdLevelColor(slot.crowdLevel)}`}>
                        {getCrowdLevelText(slot.crowdLevel)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Wait: ~{slot.waitTime}min
                      </div>
                    </div>

                    {/* Availability Bar */}
                    <div className="mt-3 w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          slot.available > slot.total * 0.7 ? 'bg-temple-green' :
                          slot.available > slot.total * 0.3 ? 'bg-temple-gold' :
                          slot.available > 0 ? 'bg-error' : 'bg-muted'
                        }`}
                        style={{ width: `${Math.max(5, (slot.available / slot.total) * 100)}%` }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No slots available for selected date</p>
              <p className="text-sm text-muted-foreground mt-1">Please select a different date</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Continue Button */}
      {selectedDate && selectedTimeSlot && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-6">
          <Button
            size="lg"
            className="sw1049-gradient text-white px-8 py-3 hover:opacity-90"
            onClick={onNextStep} // proceed to ticket selection
          >
            Continue to Ticket Selection
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DarshanBookingForm;
