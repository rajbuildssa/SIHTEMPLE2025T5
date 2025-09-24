import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TempleStatusGrid = ({ statusData = [], onStatusClick = null, gridCols = 4 }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const getStatusColor = (status, value, threshold) => {
    if (!threshold) return 'primary';
    
    const percentage = (value / threshold?.max) * 100;
    
    if (status === 'offline' || status === 'error') return 'error';
    if (status === 'warning' || percentage >= 90) return 'warning';
    if (status === 'maintenance') return 'secondary';
    if (status === 'normal' || status === 'online') return 'success';
    
    return 'primary';
  };

  const getStatusIcon = (category) => {
    const icons = {
      queue: 'Users',
      parking: 'Car',
      prasadam: 'Coffee',
      medical: 'Heart',
      security: 'Shield',
      maintenance: 'Wrench',
      donation: 'DollarSign',
      energy: 'Zap',
      water: 'Droplets',
      cleaning: 'Sparkles',
      audio: 'Volume2',
      lighting: 'Lightbulb'
    };
    return icons?.[category] || 'Activity';
  };

  const formatValue = (value, unit) => {
    if (typeof value === 'number') {
      if (unit === '%') return `${value}%`;
      if (unit === 'people') return value?.toLocaleString();
      if (unit === 'minutes') return `${value}m`;
      if (unit === 'hours') return `${value}h`;
      if (unit === '₹') return `₹${value?.toLocaleString()}`;
      return value?.toLocaleString();
    }
    return value;
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    if (onStatusClick) {
      onStatusClick(status);
    }
  };

  const StatusCard = ({ status, index }) => {
    const statusColor = getStatusColor(status?.status, status?.currentValue, status?.threshold);
    const isSelected = selectedStatus?.id === status?.id;
    
    return (
      <div
        className={`bg-card border rounded-lg p-4 transition-hover hover-lift cursor-pointer sacred-shadow-sm ${
          isSelected ? `border-${statusColor} bg-${statusColor}/5` : 'border-border'
        }`}
        onClick={() => handleStatusClick(status)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${statusColor}/20`}>
              <Icon 
                name={getStatusIcon(status?.category)} 
                size={18} 
                className={`text-${statusColor}`}
              />
            </div>
            <div>
              <h4 className="font-heading font-medium text-sm text-card-foreground">
                {status?.name}
              </h4>
              <p className="text-xs font-caption text-muted-foreground">
                {status?.location}
              </p>
            </div>
          </div>
          
          <div className={`px-2 py-1 rounded-full text-xs font-caption bg-${statusColor}/20 text-${statusColor}`}>
            {status?.status}
          </div>
        </div>
        <div className="space-y-3">
          {/* Current Value */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-body text-card-foreground">
              Current
            </span>
            <span className="font-mono font-bold text-lg text-card-foreground">
              {formatValue(status?.currentValue, status?.unit)}
            </span>
          </div>

          {/* Progress Bar */}
          {status?.threshold && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-caption text-muted-foreground">
                <span>Capacity</span>
                <span>{status?.currentValue}/{status?.threshold?.max}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-sacred bg-${statusColor}`}
                  style={{ 
                    width: `${Math.min((status?.currentValue / status?.threshold?.max) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
          )}

          {/* Additional Metrics */}
          {status?.metrics && (
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
              {Object.entries(status?.metrics)?.slice(0, 2)?.map(([key, value]) => (
                <div key={key} className="text-center">
                  <p className="text-xs font-caption text-muted-foreground capitalize">
                    {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                  </p>
                  <p className="font-mono text-sm font-medium text-card-foreground">
                    {formatValue(value, status?.unit)}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Last Updated */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-xs font-caption text-muted-foreground">
              Updated
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              {new Date(status.lastUpdated)?.toLocaleTimeString('en-IN', { 
                hour12: false, 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const StatusListItem = ({ status, index }) => {
    const statusColor = getStatusColor(status?.status, status?.currentValue, status?.threshold);
    const isSelected = selectedStatus?.id === status?.id;
    
    return (
      <div
        className={`bg-card border rounded-lg p-4 transition-hover hover-lift cursor-pointer sacred-shadow-sm ${
          isSelected ? `border-${statusColor} bg-${statusColor}/5` : 'border-border'
        }`}
        onClick={() => handleStatusClick(status)}
      >
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-${statusColor}/20 flex-shrink-0`}>
            <Icon 
              name={getStatusIcon(status?.category)} 
              size={20} 
              className={`text-${statusColor}`}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-heading font-medium text-base text-card-foreground">
                {status?.name}
              </h4>
              <div className={`px-3 py-1 rounded-full text-sm font-caption bg-${statusColor}/20 text-${statusColor}`}>
                {status?.status}
              </div>
            </div>
            <p className="text-sm font-caption text-muted-foreground mb-2">
              {status?.location}
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-caption text-muted-foreground">Current</p>
                <p className="font-mono font-bold text-lg text-card-foreground">
                  {formatValue(status?.currentValue, status?.unit)}
                </p>
              </div>
              
              {status?.threshold && (
                <div>
                  <p className="text-xs font-caption text-muted-foreground">Capacity</p>
                  <p className="font-mono text-sm text-card-foreground">
                    {status?.currentValue}/{status?.threshold?.max}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-xs font-caption text-muted-foreground">Updated</p>
                <p className="font-mono text-sm text-card-foreground">
                  {new Date(status.lastUpdated)?.toLocaleTimeString('en-IN', { 
                    hour12: false, 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-semibold text-lg text-foreground">
            Temple Status Overview
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Real-time operational metrics across all facilities
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            iconName="Grid3X3"
            onClick={() => setViewMode('grid')}
            title="Grid View"
          />
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            iconName="List"
            onClick={() => setViewMode('list')}
            title="List View"
          />
        </div>
      </div>
      {/* Status Grid/List */}
      {statusData?.length === 0 ? (
        <div className="bg-card border rounded-lg p-8 text-center sacred-shadow-sm">
          <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h4 className="font-heading font-medium text-card-foreground mb-2">
            No Status Data Available
          </h4>
          <p className="text-sm font-caption text-muted-foreground">
            Status information will appear here once data is available
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridCols} gap-4`
            : 'space-y-3'
        }>
          {statusData?.map((status, index) => (
            viewMode === 'grid' 
              ? <StatusCard key={status?.id || index} status={status} index={index} />
              : <StatusListItem key={status?.id || index} status={status} index={index} />
          ))}
        </div>
      )}
      {/* Selected Status Details Modal */}
      {selectedStatus && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg p-6 max-w-md w-full sacred-shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-heading font-semibold text-lg text-card-foreground">
                {selectedStatus?.name} Details
              </h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedStatus(null)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-caption text-muted-foreground">Status</p>
                  <p className="font-body font-medium text-card-foreground capitalize">
                    {selectedStatus?.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-caption text-muted-foreground">Location</p>
                  <p className="font-body font-medium text-card-foreground">
                    {selectedStatus?.location}
                  </p>
                </div>
              </div>
              
              {selectedStatus?.metrics && (
                <div>
                  <p className="text-sm font-caption text-muted-foreground mb-2">
                    Additional Metrics
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(selectedStatus?.metrics)?.map(([key, value]) => (
                      <div key={key} className="flex justify-between p-2 bg-muted/50 rounded">
                        <span className="text-xs font-caption text-muted-foreground capitalize">
                          {key?.replace(/([A-Z])/g, ' $1')?.trim()}
                        </span>
                        <span className="text-xs font-mono font-medium text-card-foreground">
                          {formatValue(value, selectedStatus?.unit)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button
                  variant="default"
                  size="sm"
                  iconName="RefreshCw"
                  iconPosition="left"
                  onClick={() => {/* Handle refresh */}}
                >
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => {/* Handle settings */}}
                >
                  Configure
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempleStatusGrid;