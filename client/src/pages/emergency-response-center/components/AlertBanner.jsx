import React from 'react';
import Icon from '../../../components/AppIcon';

const AlertBanner = ({ activeAlerts, systemStatus }) => {
  const getAlertSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-error text-error-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'operational': return 'bg-success text-success-foreground';
      case 'degraded': return 'bg-warning text-warning-foreground';
      case 'down': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-error/10 to-warning/10 border-l-4 border-error p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-error rounded-full breathing-animation"></div>
            <span className="font-heading font-semibold text-error">EMERGENCY RESPONSE CENTER</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning" />
            <span className="text-sm font-mono">
              {activeAlerts?.filter(alert => alert?.severity === 'critical')?.length} Critical Alerts
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-caption text-muted-foreground">System Status:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-mono ${getSystemStatusColor(systemStatus?.overall)}`}>
              {systemStatus?.overall?.toUpperCase()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={14} className="text-muted-foreground" />
            <span className="text-sm font-mono text-muted-foreground">
              Last Update: {new Date()?.toLocaleTimeString('en-US', { hour12: false })}
            </span>
          </div>
          
          <div className="flex space-x-2">
            {activeAlerts?.slice(0, 3)?.map((alert, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded-full text-xs font-mono ${getAlertSeverityColor(alert?.severity)}`}
              >
                {alert?.type}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;