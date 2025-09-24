import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const IncidentTimeline = ({ incidents, onIncidentSelect, onEscalate }) => {
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filterSeverity, setFilterSeverity] = useState('all');

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'border-error bg-error/10 text-error';
      case 'high': return 'border-warning bg-warning/10 text-warning';
      case 'medium': return 'border-secondary bg-secondary/10 text-secondary-foreground';
      case 'low': return 'border-muted bg-muted/10 text-muted-foreground';
      default: return 'border-border bg-background text-foreground';
    }
  };

  const getIncidentIcon = (type) => {
    switch (type) {
      case 'medical': return 'Heart';
      case 'security': return 'Shield';
      case 'crowd': return 'Users';
      case 'fire': return 'Flame';
      case 'technical': return 'Zap';
      default: return 'AlertCircle';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'resolved': return 'CheckCircle';
      case 'in-progress': return 'Clock';
      case 'escalated': return 'ArrowUp';
      default: return 'AlertCircle';
    }
  };

  const filteredIncidents = filterSeverity === 'all' 
    ? incidents 
    : incidents?.filter(incident => incident?.severity === filterSeverity);

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDuration = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMinutes = Math.floor((now - start) / (1000 * 60));
    
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Activity" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Live Incident Timeline</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-mono">
              {filteredIncidents?.length} Active
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-md text-sm font-caption bg-background"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            
            <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredIncidents?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="CheckCircle" size={48} className="text-success mx-auto mb-4" />
            <h4 className="font-heading font-medium text-lg mb-2">No Active Incidents</h4>
            <p className="text-muted-foreground font-caption">All systems operating normally</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {filteredIncidents?.map((incident) => (
              <div
                key={incident?.id}
                className={`border-l-4 p-4 rounded-r-lg cursor-pointer transition-hover hover-lift ${getSeverityColor(incident?.severity)} ${
                  selectedIncident?.id === incident?.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => {
                  setSelectedIncident(incident);
                  onIncidentSelect?.(incident);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex items-center space-x-2">
                      <Icon name={getIncidentIcon(incident?.type)} size={18} />
                      <Icon name={getStatusIcon(incident?.status)} size={14} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-heading font-medium text-sm truncate">
                          {incident?.title}
                        </h4>
                        <span className="px-2 py-0.5 bg-background/50 rounded-full text-xs font-mono">
                          {incident?.severity?.toUpperCase()}
                        </span>
                      </div>
                      
                      <p className="text-sm font-caption text-muted-foreground mb-2 line-clamp-2">
                        {incident?.description}
                      </p>
                      
                      <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                        <span>Location: {incident?.location}</span>
                        <span>Reporter: {incident?.reporter}</span>
                        <span>Duration: {formatDuration(incident?.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className="text-xs font-mono text-muted-foreground">
                      {formatTime(incident?.timestamp)}
                    </span>
                    
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="MessageCircle"
                        onClick={(e) => {
                          e?.stopPropagation();
                          // Handle communication
                        }}
                      />
                      
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="ArrowUp"
                        onClick={(e) => {
                          e?.stopPropagation();
                          onEscalate?.(incident);
                        }}
                      />
                      
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="ExternalLink"
                        onClick={(e) => {
                          e?.stopPropagation();
                          // Handle view details
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {incident?.assignedTo && (
                  <div className="mt-3 pt-3 border-t border-border/50">
                    <div className="flex items-center space-x-2">
                      <Icon name="User" size={14} className="text-muted-foreground" />
                      <span className="text-xs font-caption text-muted-foreground">
                        Assigned to: {incident?.assignedTo}
                      </span>
                      {incident?.eta && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-xs font-caption text-muted-foreground">
                            ETA: {incident?.eta}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IncidentTimeline;