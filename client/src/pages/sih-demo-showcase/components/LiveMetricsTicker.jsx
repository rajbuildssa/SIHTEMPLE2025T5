import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, DollarSign, AlertTriangle, Activity, Timer } from 'lucide-react';

const LiveMetricsTicker = ({ scenario, isPlaying }) => {
  const [metrics, setMetrics] = useState([
    { id: 1, icon: Users, label: 'Live Devotees', value: 247, trend: '+12', color: 'text-temple-saffron' },
    { id: 2, icon: DollarSign, label: 'Revenue Today', value: '₹45,230', trend: '+8%', color: 'text-temple-green' },
    { id: 3, icon: Timer, label: 'Avg Wait Time', value: '15 min', trend: '-3 min', color: 'text-temple-gold' },
    { id: 4, icon: Activity, label: 'System Load', value: '67%', trend: 'stable', color: 'text-sw1049-primary' },
    { id: 5, icon: AlertTriangle, label: 'Active Alerts', value: 2, trend: 'resolved 3', color: 'text-error' },
    { id: 6, icon: TrendingUp, label: 'Satisfaction', value: '4.8/5', trend: '+0.2', color: 'text-success' }
  ]);

  // Update metrics based on scenario and time
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setMetrics(prev => prev?.map(metric => {
        let newValue = metric?.value;
        let newTrend = metric?.trend;

        switch (scenario) {
          case 'festival':
            if (metric?.id === 1) { // Users
              newValue = Math.max(400, parseInt(String(metric?.value)) + Math.floor(Math.random() * 20) - 5);
              newTrend = '+' + Math.floor(Math.random() * 25 + 10);
            } else if (metric?.id === 2) { // Revenue
              const currentRevenue = parseInt(String(metric?.value)?.replace(/[₹,]/g, ''));
              newValue = '₹' + (currentRevenue + Math.floor(Math.random() * 2000))?.toLocaleString();
              newTrend = '+' + Math.floor(Math.random() * 5 + 8) + '%';
            } else if (metric?.id === 3) { // Wait Time
              newValue = Math.max(25, parseInt(String(metric?.value)) + Math.floor(Math.random() * 10) - 2) + ' min';
              newTrend = '+' + Math.floor(Math.random() * 8) + ' min';
            }
            break;

          case 'emergency':
            if (metric?.id === 1) { // Users - decreasing during emergency
              newValue = Math.max(50, parseInt(String(metric?.value)) - Math.floor(Math.random() * 15 + 5));
              newTrend = '-' + Math.floor(Math.random() * 20 + 10);
            } else if (metric?.id === 5) { // Alerts
              newValue = Math.min(8, parseInt(String(metric?.value)) + Math.floor(Math.random() * 3));
              newTrend = 'CRITICAL';
            } else if (metric?.id === 4) { // System Load
              newValue = Math.min(95, parseInt(String(metric?.value)) + Math.floor(Math.random() * 10)) + '%';
              newTrend = 'HIGH';
            }
            break;

          default:
            // Normal fluctuations
            if (metric?.id === 1) {
              newValue = Math.max(150, parseInt(String(metric?.value)) + Math.floor(Math.random() * 20) - 10);
              newTrend = (Math.random() > 0.5 ? '+' : '-') + Math.floor(Math.random() * 15);
            } else if (metric?.id === 2) {
              const currentRevenue = parseInt(String(metric?.value)?.replace(/[₹,]/g, ''));
              newValue = '₹' + (currentRevenue + Math.floor(Math.random() * 1000))?.toLocaleString();
              newTrend = '+' + Math.floor(Math.random() * 3 + 2) + '%';
            }
            break;
        }

        return { ...metric, value: newValue, trend: newTrend };
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [scenario, isPlaying]);

  const getScenarioStyle = () => {
    switch (scenario) {
      case 'festival':
        return 'bg-gradient-to-r from-temple-saffron/20 to-temple-gold/20 border-temple-saffron/30';
      case 'emergency':
        return 'bg-gradient-to-r from-error/20 to-warning/20 border-error/30';
      default:
        return 'bg-gradient-to-r from-sw1049-primary/20 to-temple-gold/20 border-temple-gold/30';
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className={`rounded-lg p-6 border-2 ${getScenarioStyle()} sacred-shadow`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-sw1049-primary flex items-center">
          <Activity className="mr-2 h-6 w-6" />
          Live Temple Metrics
        </h3>
        
        <div className="flex items-center space-x-2">
          <motion.div
            animate={{
              scale: isPlaying ? [1, 1.2, 1] : 1,
              opacity: isPlaying ? [1, 0.7, 1] : 0.5
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${
              isPlaying ? 'bg-success' : 'bg-muted'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isPlaying ? 'Live Updates' : 'Paused'}
          </span>
        </div>
      </div>
      {/* Scrolling Metrics */}
      <div className="overflow-hidden">
        <motion.div
          animate={{
            x: isPlaying ? [0, -100 * metrics?.length] : 0
          }}
          transition={{
            duration: metrics?.length * 4,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex space-x-6 pb-2"
        >
          {/* Duplicate metrics for seamless scrolling */}
          {[...metrics, ...metrics]?.map((metric, index) => {
            const IconComponent = metric?.icon;
            return (
              <motion.div
                key={`${metric?.id}-${index}`}
                whileHover={{ scale: 1.05 }}
                className="bg-card rounded-lg p-4 sacred-shadow-sm min-w-[200px] flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-2">
                  <IconComponent className={`h-5 w-5 ${metric?.color}`} />
                  <motion.span
                    key={metric?.trend}
                    initial={{ scale: 1.2, color: '#FF6B35' }}
                    animate={{ scale: 1, color: 'inherit' }}
                    transition={{ duration: 0.3 }}
                    className={`text-xs px-2 py-1 rounded-full ${
                      scenario === 'emergency' && metric?.id === 5 ?'bg-error/20 text-error' :'bg-muted text-muted-foreground'
                    }`}
                  >
                    {metric?.trend}
                  </motion.span>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{metric?.label}</p>
                  <motion.p
                    key={metric?.value}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className={`text-xl font-bold ${metric?.color}`}
                  >
                    {metric?.value}
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {/* Quick Stats Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Peak Hours', value: '10AM - 2PM', icon: Timer },
          { label: 'Capacity Used', value: `${Math.round((parseInt(String(metrics?.[0]?.value)) / 500) * 100)}%`, icon: Users },
          { label: 'Response Time', value: scenario === 'emergency' ? '<30s' : '2.3s', icon: Activity },
          { label: 'Uptime', value: '99.9%', icon: TrendingUp }
        ]?.map((stat, index) => {
          const IconComponent = stat?.icon;
          return (
            <motion.div
              key={stat?.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-3 bg-card/50 rounded-lg"
            >
              <IconComponent className="h-4 w-4 text-temple-gold mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">{stat?.label}</p>
              <p className="font-semibold text-sm text-primary">{stat?.value}</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default LiveMetricsTicker;