import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LiveAlertFeed = ({ alerts = [], onAlertAction = null, maxVisible = 10 }) => {
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let filtered = alerts;
    
    if (selectedSeverity !== 'all') {
      filtered = alerts?.filter(alert => alert?.severity === selectedSeverity);
    }
    
    // Sort by timestamp (newest first) and limit
    filtered = filtered?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))?.slice(0, isExpanded ? alerts?.length : maxVisible);
    
    setFilteredAlerts(filtered);
  }, [alerts, selectedSeverity, isExpanded, maxVisible]);

  const getSeverityConfig = (severity) => {
    const configs = {
      critical: {
        color: 'error',
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        icon: 'AlertTriangle',
        label: 'Critical'
      },
      high: {
        color: 'warning',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        icon: 'AlertCircle',
        label: 'High'
      },
      medium: {
        color: 'secondary',
        bgColor: 'bg-secondary/10',
        borderColor: 'border-secondary/20',
        icon: 'Info',
        label: 'Medium'
      },
      low: {
        color: 'muted-foreground',
        bgColor: 'bg-muted/50',
        borderColor: 'border-muted',
        icon: 'Bell',
        label: 'Low'
      }
    };
    return configs?.[severity] || configs?.low;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffMs = now - alertTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return alertTime?.toLocaleDateString('en-IN');
  };

  const getAlertTypeIcon = (type) => {
    const icons = {
      capacity: 'Users',
      emergency: 'Phone',
      system: 'Server',
      security: 'Shield',
      maintenance: 'Wrench',
      weather: 'Cloud',
      traffic: 'Car',
      donation: 'DollarSign'
    };
    return icons?.[type] || 'Bell';
  };

  const severityOptions = [
    { value: 'all', label: 'All Alerts', count: alerts?.length },
    { value: 'critical', label: 'Critical', count: alerts?.filter(a => a?.severity === 'critical')?.length },
    { value: 'high', label: 'High', count: alerts?.filter(a => a?.severity === 'high')?.length },
    { value: 'medium', label: 'Medium', count: alerts?.filter(a => a?.severity === 'medium')?.length },
    { value: 'low', label: 'Low', count: alerts?.filter(a => a?.severity === 'low')?.length }
  ];

  const handleAlertAction = (alert, action) => {
    if (onAlertAction) {
      onAlertAction(alert, action);
    }
  };

  return (
    <div className="bg-card border rounded-lg sacred-shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full breathing-animation" />
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              Live Alerts
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-caption text-muted-foreground">
              {filteredAlerts?.length} of {alerts?.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </Button>
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex flex-wrap gap-2">
          {severityOptions?.map((option) => (
            <Button
              key={option?.value}
              variant={selectedSeverity === option?.value ? 'default' : 'ghost'}
              size="sm"
              className="text-xs"
              onClick={() => setSelectedSeverity(option?.value)}
            >
              {option?.label}
              {option?.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-muted rounded-full text-xs">
                  {option?.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>
      {/* Alert List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredAlerts?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="font-heading font-medium text-card-foreground mb-2">
              All Clear
            </h4>
            <p className="text-sm font-caption text-muted-foreground">
              No alerts matching your filter criteria
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredAlerts?.map((alert, index) => {
              const severityConfig = getSeverityConfig(alert?.severity);
              
              return (
                <div
                  key={alert?.id || index}
                  className={`p-4 rounded-lg border transition-hover hover-lift ${
                    severityConfig?.bgColor
                  } ${severityConfig?.borderColor}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Alert Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${severityConfig?.color}/20 flex-shrink-0`}>
                      <Icon 
                        name={getAlertTypeIcon(alert?.type)} 
                        size={16} 
                        className={`text-${severityConfig?.color}`}
                      />
                    </div>

                    {/* Alert Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-heading font-medium text-sm text-card-foreground truncate">
                            {alert?.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.5 text-xs font-caption rounded-full bg-${severityConfig?.color}/20 text-${severityConfig?.color}`}>
                              {severityConfig?.label}
                            </span>
                            <span className="text-xs font-caption text-muted-foreground">
                              {alert?.location}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-muted-foreground whitespace-nowrap ml-2">
                          {formatTimeAgo(alert?.timestamp)}
                        </span>
                      </div>

                      <p className="text-sm font-body text-card-foreground mb-3 leading-relaxed">
                        {alert?.message}
                      </p>

                      {/* Alert Metrics */}
                      {alert?.metrics && (
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          {Object.entries(alert?.metrics)?.map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-xs font-caption text-muted-foreground capitalize">
                                {key?.replace(/([A-Z])/g, ' $1')?.trim()}:
                              </span>
                              <span className="text-xs font-mono font-medium text-card-foreground">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Buttons */}
                      {alert?.actions && alert?.actions?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {alert?.actions?.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant={action?.primary ? 'default' : 'outline'}
                              size="sm"
                              iconName={action?.icon}
                              iconPosition="left"
                              className="text-xs"
                              onClick={() => handleAlertAction(alert, action)}
                            >
                              {action?.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* Footer */}
      {alerts?.length > maxVisible && !isExpanded && (
        <div className="p-4 border-t border-border text-center">
          <Button
            variant="ghost"
            size="sm"
            iconName="ChevronDown"
            iconPosition="right"
            onClick={() => setIsExpanded(true)}
          >
            Show {alerts?.length - maxVisible} more alerts
          </Button>
        </div>
      )}
    </div>
  );
};

export default LiveAlertFeed;