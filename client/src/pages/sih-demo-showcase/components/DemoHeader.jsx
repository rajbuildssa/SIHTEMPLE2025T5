import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Users } from 'lucide-react';

const DemoHeader = ({ teamId }) => {
  return (
    <motion.div 
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-gradient-to-r from-sw1049-primary via-temple-saffron to-temple-gold sacred-shadow-lg"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              <Trophy className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <motion.h1 
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg"
              >
                SIH 2024 Demo Showcase
              </motion.h1>
              <motion.p 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/90 text-sm md:text-base"
              >
                Smart India Hackathon - Temple Management Solution
              </motion.p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-white" />
                <span className="text-white font-semibold">Team {teamId}</span>
              </div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20"
            >
              <div className="flex items-center space-x-2">
                <Award className="h-4 w-4 text-white" />
                <span className="text-white font-semibold">Live Demo</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Demo Status Bar */}
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 bg-white/10 backdrop-blur-sm rounded-full p-1"
        >
          <div className="bg-gradient-to-r from-temple-white to-temple-gold rounded-full px-4 py-2 text-center">
            <span className="text-temple-red font-semibold text-sm">
              🔴 LIVE • Autonomous Temple Management System Demo
            </span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DemoHeader;