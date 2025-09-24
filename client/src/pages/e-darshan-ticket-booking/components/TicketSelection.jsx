import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, Users, Crown, Heart, Plus, Minus } from 'lucide-react';
import Button from '../../../components/ui/Button';

const TicketSelection = ({ temple, ticketType, numberOfTickets, onTicketTypeChange, onQuantityChange, onNext }) => {
  const ticketTypes = [
    {
      id: 'regular',
      name: 'Regular Darshan',
      icon: Users,
      description: 'Standard queue access with general darshan experience',
      features: ['General temple access', 'Standard queue', 'Basic facilities'],
      color: 'temple-saffron',
      price: temple?.ticketPrices?.regular || 50
    },
    {
      id: 'vip',
      name: 'VIP Darshan',
      icon: Crown,
      description: 'Priority access with enhanced darshan experience',
      features: ['Skip the queue', 'Closer darshan view', 'VIP facilities', 'Complimentary prasadam'],
      color: 'temple-gold',
      popular: true,
      price: temple?.ticketPrices?.vip || 200
    },
    {
      id: 'senior',
      name: 'Senior Citizen',
      icon: Heart,
      description: 'Special rates for senior citizens (60+ years)',
      features: ['Discounted rates', 'Separate queue', 'Assisted access'],
      color: 'temple-green',
      price: temple?.ticketPrices?.senior || 25
    }
  ];

  const selectedTicketInfo = ticketTypes.find(type => type.id === ticketType);
  const totalAmount = selectedTicketInfo ? selectedTicketInfo.price * numberOfTickets : 0;

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, Math.min(10, numberOfTickets + change));
    onQuantityChange(newQuantity);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Select Your Tickets</h2>
        <p className="text-muted-foreground mb-4">
          Choose the type and number of tickets for your darshan
        </p>
        {temple && (
          <div className="inline-flex items-center space-x-2 bg-muted rounded-full px-4 py-2">
            <span className="text-temple-saffron">🏛️</span>
            <span className="font-semibold">{temple?.name}</span>
          </div>
        )}
      </div>

      {/* Ticket Type Selection */}
      <div className="bg-card rounded-lg sacred-shadow p-6">
        <h3 className="text-lg font-semibold mb-6 flex items-center">
          <Ticket className="mr-2 h-5 w-5 text-temple-gold" />
          Ticket Types
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ticketTypes.map((type, index) => {
            const IconComponent = type.icon;
            const isSelected = ticketType === type.id;

            return (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative border-2 rounded-lg p-6 cursor-pointer transition-sacred ${
                  isSelected
                    ? `border-${type.color} bg-${type.color}/10`
                    : 'border-border hover:border-temple-gold hover:bg-temple-gold/5'
                }`}
                onClick={() => onTicketTypeChange(type.id)}
              >
                {type.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-temple-gold text-white text-xs font-bold px-3 py-1 rounded-full">
                      POPULAR
                    </span>
                  </div>
                )}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-success rounded-full flex items-center justify-center"
                  >
                    <span className="text-white text-sm font-bold">✓</span>
                  </motion.div>
                )}
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-${type.color}/20 flex items-center justify-center mr-3`}>
                    <IconComponent className={`h-5 w-5 text-${type.color}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-primary">{type.name}</h4>
                    <p className={`text-2xl font-bold text-${type.color}`}>₹{type.price}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{type.description}</p>
                <div className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm">
                      <span className="text-temple-green mr-2">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={(e) => { e.stopPropagation(); onTicketTypeChange(type.id); }}
                  className={`w-full mt-4 ${isSelected ? 'sw1049-gradient text-white' :'border-temple-gold hover:bg-temple-gold/10'}`}
                  variant={isSelected ? "default" : "outline"}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quantity Selection */}
      {ticketType && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg sacred-shadow p-6"
        >
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Users className="mr-2 h-5 w-5 text-temple-saffron" />
            Number of Tickets
          </h3>
          <div className="flex items-center justify-center space-x-6">
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleQuantityChange(-1)}
              disabled={numberOfTickets <= 1}
              className="w-12 h-12 rounded-full border-temple-gold hover:bg-temple-gold/10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{numberOfTickets}</div>
              <div className="text-sm text-muted-foreground">{numberOfTickets === 1 ? 'Ticket' : 'Tickets'}</div>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleQuantityChange(1)}
              disabled={numberOfTickets >= 10}
              className="w-12 h-12 rounded-full border-temple-gold hover:bg-temple-gold/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-center mt-4 text-xs text-muted-foreground">
            Maximum 10 tickets per booking
          </div>
        </motion.div>
      )}

      {/* Booking Summary */}
      {ticketType && numberOfTickets > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-temple-saffron/10 to-temple-gold/10 rounded-lg p-6 border border-temple-gold/30"
        >
          <h3 className="text-lg font-semibold mb-4 text-primary">Booking Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Ticket Type:</span>
              <span className="font-semibold">{selectedTicketInfo?.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Quantity:</span>
              <span className="font-semibold">{numberOfTickets} ticket{numberOfTickets > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Price per ticket:</span>
              <span className="font-semibold">₹{selectedTicketInfo?.price}</span>
            </div>
            <div className="border-t border-temple-gold/30 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-primary">Total Amount:</span>
                <span className="text-2xl font-bold text-temple-saffron">₹{totalAmount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      {ticketType && numberOfTickets > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center pt-6">
          <Button size="lg" onClick={onNext} className="sw1049-gradient text-white px-8 py-3 hover:opacity-90">
            Continue to Devotee Details
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TicketSelection;
