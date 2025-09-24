import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const GlobalControlPanel = ({ 
  onLocationChange = null,
  onDateRangeChange = null,
  onRefresh = null,
  connectionStatus = 'connected',
  lastUpdate = new Date()
}) => {
  const [selectedLocation, setSelectedLocation] = useState('dwarka-main');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);

  // Auto-refresh timer
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      if (onRefresh) onRefresh();
    }, refreshInterval * 1000);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, onRefresh]);

  const templeLocations = [
    { value: 'dwarka-main', label: 'Dwarka Main Temple', description: 'Primary temple complex' },
    { value: 'dwarka-north', label: 'Dwarka North Wing', description: 'Secondary worship area' },
    { value: 'dwarka-gardens', label: 'Temple Gardens', description: 'Outdoor meditation space' },
    { value: 'dwarka-parking', label: 'Parking Complex', description: 'Vehicle management area' },
    { value: 'all-locations', label: 'All Locations', description: 'Combined view' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today', description: 'Current day data' },
    { value: 'yesterday', label: 'Yesterday', description: 'Previous day comparison' },
    { value: 'this-week', label: 'This Week', description: 'Weekly overview' },
    { value: 'last-week', label: 'Last Week', description: 'Previous week data' },
    { value: 'this-month', label: 'This Month', description: 'Monthly trends' },
    { value: 'festival-season', label: 'Festival Season', description: 'Special event period' },
    { value: 'custom', label: 'Custom Range', description: 'Select specific dates' }
  ];

  const festivalPresets = [
    { value: 'diwali-2024', label: 'Diwali 2024', start: '2024-10-30', end: '2024-11-03' },
    { value: 'holi-2024', label: 'Holi 2024', start: '2024-03-08', end: '2024-03-10' },
    { value: 'navratri-2024', label: 'Navratri 2024', start: '2024-10-03', end: '2024-10-12' },
    { value: 'janmashtami-2024', label: 'Janmashtami 2024', start: '2024-08-26', end: '2024-08-27' }
  ];

  const refreshIntervalOptions = [
    { value: 3, label: '3 seconds' },
    { value: 10, label: '10 seconds' },
    { value: 30, label: '30 seconds' },
    { value: 60, label: '1 minute' },
    { value: 300, label: '5 minutes' }
  ];

  const handleLocationChange = (value) => {
    setSelectedLocation(value);
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  const handleDateRangeChange = (value) => {
    setSelectedDateRange(value);
    setIsCustomRange(value === 'custom');
    
    if (value !== 'custom' && onDateRangeChange) {
      onDateRangeChange({ type: value });
    }
  };

  const handleCustomDateSubmit = () => {
    if (customDateRange?.start && customDateRange?.end && onDateRangeChange) {
      onDateRangeChange({
        type: 'custom',
        start: customDateRange?.start,
        end: customDateRange?.end
      });
    }
  };

  const handleFestivalPreset = (preset) => {
    setCustomDateRange({ start: preset?.start, end: preset?.end });
    if (onDateRangeChange) {
      onDateRangeChange({
        type: 'custom',
        start: preset?.start,
        end: preset?.end,
        label: preset?.label
      });
    }
  };

  const getConnectionStatusConfig = () => {
    const configs = {
      connected: {
        color: 'success',
        icon: 'Wifi',
        label: 'Connected',
        description: 'Real-time data streaming'
      },
      connecting: {
        color: 'warning',
        icon: 'Loader',
        label: 'Connecting',
        description: 'Establishing connection'
      },
      disconnected: {
        color: 'error',
        icon: 'WifiOff',
        label: 'Disconnected',
        description: 'Connection lost'
      }
    };
    return configs?.[connectionStatus] || configs?.disconnected;
  };

  const statusConfig = getConnectionStatusConfig();

  const formatLastUpdate = () => {
    return lastUpdate?.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 sacred-shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Location Selector */}
        <div className="lg:col-span-3">
          <Select
            label="Temple Location"
            options={templeLocations}
            value={selectedLocation}
            onChange={handleLocationChange}
            searchable
          />
        </div>

        {/* Date Range Selector */}
        <div className="lg:col-span-3">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={selectedDateRange}
            onChange={handleDateRangeChange}
          />
        </div>

        {/* Custom Date Range */}
        {isCustomRange && (
          <div className="lg:col-span-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-caption text-muted-foreground mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customDateRange?.start}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, start: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-caption text-muted-foreground mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customDateRange?.end}
                  onChange={(e) => setCustomDateRange(prev => ({ ...prev, end: e?.target?.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm"
                />
              </div>
            </div>
            
            {/* Festival Presets */}
            <div>
              <label className="block text-sm font-caption text-muted-foreground mb-2">
                Festival Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {festivalPresets?.map((preset) => (
                  <Button
                    key={preset?.value}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFestivalPreset(preset)}
                    className="text-xs"
                  >
                    {preset?.label}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={handleCustomDateSubmit}
              disabled={!customDateRange?.start || !customDateRange?.end}
            >
              Apply Range
            </Button>
          </div>
        )}

        {/* Connection Status & Controls */}
        <div className={`${isCustomRange ? 'lg:col-span-2' : 'lg:col-span-6'} space-y-4`}>
          {/* Connection Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${statusConfig?.color}/20`}>
                <Icon 
                  name={statusConfig?.icon} 
                  size={16} 
                  className={`text-${statusConfig?.color} ${statusConfig?.icon === 'Loader' ? 'animate-spin' : ''}`}
                />
              </div>
              <div>
                <p className="font-body font-medium text-sm text-card-foreground">
                  {statusConfig?.label}
                </p>
                <p className="text-xs font-caption text-muted-foreground">
                  {statusConfig?.description}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-caption text-muted-foreground">Last Update</p>
              <p className="font-mono text-sm font-medium text-card-foreground">
                {formatLastUpdate()}
              </p>
            </div>
          </div>

          {/* Auto-refresh Controls */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Button
                variant={autoRefresh ? 'default' : 'outline'}
                size="sm"
                iconName={autoRefresh ? 'Pause' : 'Play'}
                iconPosition="left"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Pause' : 'Resume'}
              </Button>
              
              {autoRefresh && (
                <Select
                  options={refreshIntervalOptions}
                  value={refreshInterval}
                  onChange={setRefreshInterval}
                  className="w-32"
                />
              )}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={onRefresh}
              title="Manual Refresh"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-heading font-medium text-sm text-card-foreground mb-1">
              Quick Actions
            </h4>
            <p className="text-xs font-caption text-muted-foreground">
              Common operations and emergency controls
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
              onClick={() => {/* Handle export */}}
            >
              Export Data
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
              onClick={() => {/* Handle settings */}}
            >
              Settings
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              iconName="Phone"
              iconPosition="left"
              onClick={() => {/* Handle emergency */}}
            >
              Emergency
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalControlPanel;