import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Users, AlertTriangle, DollarSign, Activity } from 'lucide-react';

const MainVisualization = ({ currentScene, scenario, isAutoPlaying, demoProgress }) => {
  const [liveData, setLiveData] = useState({
    crowdCount: 150,
    revenue: 25000,
    alerts: 2,
    satisfaction: 4.8,
    operations: 'normal'
  });

  // Simulate real-time data updates
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setLiveData(prev => ({
        crowdCount: Math.max(50, prev?.crowdCount + Math.floor(Math.random() * 20) - 10),
        revenue: prev?.revenue + Math.floor(Math.random() * 1000),
        alerts: Math.max(0, Math.min(5, prev?.alerts + Math.floor(Math.random() * 3) - 1)),
        satisfaction: Math.max(1, Math.min(5, prev?.satisfaction + (Math.random() * 0.4) - 0.2)),
        operations: ['normal', 'busy', 'peak']?.[Math.floor(Math.random() * 3)]
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const getScenarioData = () => {
    switch (scenario) {
      case 'festival':
        return {
          multiplier: 3,
          crowdLevel: 'high',
          alertLevel: 'medium',
          description: 'Festival Peak Hours - High Volume Operations'
        };
      case 'emergency':
        return {
          multiplier: 0.5,
          crowdLevel: 'evacuating',
          alertLevel: 'critical',
          description: 'Emergency Response Mode - Safety Priority'
        };
      default:
        return {
          multiplier: 1,
          crowdLevel: 'normal',
          alertLevel: 'low',
          description: 'Normal Operations - Steady Flow'
        };
    }
  };

  const scenarioData = getScenarioData();
  const adjustedData = {
    ...liveData,
    crowdCount: Math.floor(liveData?.crowdCount * scenarioData?.multiplier),
    alerts: scenario === 'emergency' ? 5 : liveData?.alerts
  };

  const renderVisualizationContent = () => {
    switch (currentScene?.id) {
      case 'operations':
        return (
          <div className="grid grid-cols-2 gap-4 h-full">
            <motion.div 
              className="bg-gradient-to-br from-temple-saffron/20 to-temple-gold/20 rounded-lg p-6 flex flex-col justify-center items-center"
              whileHover={{ scale: 1.02 }}
            >
              <Activity className="h-12 w-12 text-temple-saffron mb-4" />
              <h3 className="text-xl font-bold text-center">Temple Operations</h3>
              <p className="text-muted-foreground text-center mt-2">Status: {adjustedData?.operations}</p>
              <div className="mt-4 w-full bg-muted rounded-full h-3">
                <motion.div
                  className="h-3 temple-gradient rounded-full"
                  animate={{ width: `${demoProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
            <div className="grid grid-rows-2 gap-4">
              <motion.div 
                className="bg-card rounded-lg p-4 sacred-shadow flex items-center justify-between"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <div>
                  <p className="text-sm text-muted-foreground">Live Devotees</p>
                  <p className="text-2xl font-bold text-sw1049-primary">{adjustedData?.crowdCount}</p>
                </div>
                <Users className="h-8 w-8 text-temple-saffron" />
              </motion.div>
              
              <motion.div 
                className="bg-card rounded-lg p-4 sacred-shadow flex items-center justify-between"
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <p className="text-sm text-muted-foreground">Active Alerts</p>
                  <p className="text-2xl font-bold text-error">{adjustedData?.alerts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-error" />
              </motion.div>
            </div>
          </div>
        );

      case 'crowd':
        return (
          <div className="h-full flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-temple-gold/20 to-temple-saffron/20 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold mb-4 text-center">Crowd Analytics Heatmap</h3>
              <div className="grid grid-cols-8 gap-1 h-40">
                {Array.from({ length: 64 }, (_, i) => (
                  <motion.div
                    key={i}
                    className={`rounded ${
                      i % 3 === 0 ? 'bg-temple-red/60' : 
                      i % 3 === 1 ? 'bg-temple-gold/60': 'bg-temple-green/60'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.01 }}
                  />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <motion.div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <TrendingUp className="h-6 w-6 text-temple-green mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Trend</p>
                <p className="font-bold text-temple-green">↗ Rising</p>
              </motion.div>
              
              <motion.div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <Users className="h-6 w-6 text-temple-saffron mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-bold">{Math.round((adjustedData?.crowdCount / 500) * 100)}%</p>
              </motion.div>
              
              <motion.div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <Activity className="h-6 w-6 text-temple-red mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Wait Time</p>
                <p className="font-bold">{Math.round(adjustedData?.crowdCount / 10)} min</p>
              </motion.div>
            </div>
          </div>
        );

      case 'emergency':
        return (
          <div className="h-full flex flex-col">
            <motion.div 
              className="flex-1 bg-gradient-to-br from-error/20 to-warning/20 rounded-lg p-6 mb-4"
              animate={{ 
                boxShadow: scenario === 'emergency' ?'0 0 30px rgba(220, 38, 38, 0.3)' :'0 4px 8px rgba(0,0,0,0.1)' 
              }}
            >
              <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center">
                <AlertTriangle className="mr-2 h-6 w-6 text-error" />
                Emergency Response Center
              </h3>
              
              <div className="grid grid-cols-2 gap-4 h-32">
                <div className="bg-card rounded-lg p-4 flex flex-col justify-center">
                  <h4 className="font-semibold mb-2">Response Status</h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      scenario === 'emergency' ?'bg-error breathing-animation' :'bg-success'
                    }`} />
                    <span className="text-sm">
                      {scenario === 'emergency' ? 'ACTIVE RESPONSE' : 'STANDBY'}
                    </span>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg p-4 flex flex-col justify-center">
                  <h4 className="font-semibold mb-2">Staff Dispatch</h4>
                  <p className="text-2xl font-bold text-temple-saffron">
                    {scenario === 'emergency' ? '12' : '3'} Active
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div className="bg-card rounded-lg p-4 sacred-shadow">
              <h4 className="font-semibold mb-2">Recent Incidents</h4>
              <div className="space-y-2">
                {[
                  { time: '14:23', type: 'Crowd Density', status: 'resolved' },
                  { time: '13:45', type: 'Medical Assistance', status: 'active' },
                  { time: '12:30', type: 'Lost Child', status: 'resolved' }
                ]?.map((incident, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span>{incident?.time} - {incident?.type}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      incident?.status === 'active' ?'bg-error/20 text-error' :'bg-success/20 text-success'
                    }`}>
                      {incident?.status}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        );

      case 'financial':
        return (
          <div className="h-full flex flex-col">
            <motion.div className="flex-1 bg-gradient-to-br from-temple-green/20 to-temple-gold/20 rounded-lg p-6 mb-4">
              <h3 className="text-xl font-bold mb-4 text-center flex items-center justify-center">
                <DollarSign className="mr-2 h-6 w-6 text-temple-green" />
                Financial Analytics
              </h3>
              
              <div className="grid grid-cols-2 gap-4 h-32">
                <div className="bg-card rounded-lg p-4 flex flex-col justify-center">
                  <h4 className="font-semibold mb-2">Daily Revenue</h4>
                  <p className="text-2xl font-bold text-temple-green">
                    ₹{adjustedData?.revenue?.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-card rounded-lg p-4 flex flex-col justify-center">
                  <h4 className="font-semibold mb-2">Donation Trend</h4>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-temple-green" />
                    <span className="text-temple-green font-semibold">+15.3%</span>
                  </div>
                </div>
              </div>
            </motion.div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <p className="text-sm text-muted-foreground">Transactions</p>
                <p className="text-xl font-bold text-sw1049-primary">{Math.floor(adjustedData?.crowdCount * 0.8)}</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <p className="text-sm text-muted-foreground">Avg Donation</p>
                <p className="text-xl font-bold text-temple-gold">₹{Math.floor(adjustedData?.revenue / adjustedData?.crowdCount)}</p>
              </div>
              
              <div className="bg-card rounded-lg p-4 sacred-shadow text-center">
                <p className="text-sm text-muted-foreground">Satisfaction</p>
                <p className="text-xl font-bold text-temple-saffron">
                  ⭐ {adjustedData?.satisfaction?.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="h-full flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <Activity className="h-16 w-16 text-temple-saffron mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Demo Visualization</h3>
              <p className="text-muted-foreground">Select a scene to begin the demonstration</p>
            </motion.div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-lg sacred-shadow p-6 h-96"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-primary">
          {currentScene?.title || 'Demo Visualization'}
        </h2>
        
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            isAutoPlaying ? 'bg-success breathing-animation' : 'bg-muted'
          }`} />
          <span className="text-sm text-muted-foreground">
            {scenarioData?.description}
          </span>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene?.id + scenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="h-80"
        >
          {renderVisualizationContent()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default MainVisualization;