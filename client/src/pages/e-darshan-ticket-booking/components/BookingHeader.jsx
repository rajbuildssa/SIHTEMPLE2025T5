import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, MapPin, Shield } from 'lucide-react';

const BookingHeader = ({ teamId }) => {
  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-temple-saffron via-temple-gold to-sw1049-primary sacred-shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Ticket className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent drop-shadow-lg"
              >
                E-Darshan Ticket Booking
              </motion.h1>
              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent text-sm md:text-base font-medium"
              >
                Seamless Divine Experience • Skip the Queue
              </motion.p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-white" />
                <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">Secure</span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-white" />
                <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent font-semibold">Team {teamId}</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Strip */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 bg-white/10 backdrop-blur-sm rounded-full p-2"
        >
          <div className="flex justify-center space-x-8 text-white text-sm">
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">✓</span>
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">Instant Confirmation</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">✓</span>
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">QR Code Entry</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">✓</span>
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">Mobile Wallet</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">✓</span>
              <span className="bg-gradient-to-r from-black via-orange-600 to-orange-500 bg-clip-text text-transparent">Real-time Updates</span>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookingHeader;
