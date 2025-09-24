import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeatMapVisualization = ({ data, onTimeSelect }) => {
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // week, month, year
  const [hoveredCell, setHoveredCell] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Generate mock heatmap data
  const generateHeatmapData = () => {
    const heatmapData = [];
    days?.forEach((day, dayIndex) => {
      hours?.forEach((hour) => {
        const baseVisitors = Math.floor(Math.random() * 500) + 100;
        const peakMultiplier = (hour >= 6 && hour <= 10) || (hour >= 17 && hour <= 21) ? 1.5 : 1;
        const weekendMultiplier = dayIndex >= 5 ? 1.3 : 1;
        const visitors = Math.floor(baseVisitors * peakMultiplier * weekendMultiplier);
        
        heatmapData?.push({
          day: dayIndex,
          hour,
          visitors,
          capacity: 800,
          utilization: (visitors / 800) * 100,
          dayName: day,
          timeSlot: `${hour?.toString()?.padStart(2, '0')}:00`
        });
      });
    });
    return heatmapData;
  };

  const [heatmapData, setHeatmapData] = useState(generateHeatmapData());

  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapData(generateHeatmapData());
    }, 300000); // Update every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const getIntensityColor = (utilization) => {
    if (utilization >= 90) return 'bg-error';
    if (utilization >= 75) return 'bg-warning';
    if (utilization >= 50) return 'bg-primary';
    if (utilization >= 25) return 'bg-secondary';
    return 'bg-muted';
  };

  const getIntensityOpacity = (utilization) => {
    if (utilization >= 90) return 'opacity-100';
    if (utilization >= 75) return 'opacity-80';
    if (utilization >= 50) return 'opacity-60';
    if (utilization >= 25) return 'opacity-40';
    return 'opacity-20';
  };

  const handleCellClick = (cellData) => {
    setSelectedPeriod(cellData);
    onTimeSelect && onTimeSelect(cellData);
  };

  const handleCellHover = (cellData) => {
    setHoveredCell(cellData);
  };

  const getSelectedPeriodData = () => {
    if (!selectedPeriod) return null;
    
    return {
      timeRange: `${selectedPeriod?.dayName} ${selectedPeriod?.timeSlot}`,
      visitors: selectedPeriod?.visitors,
      utilization: selectedPeriod?.utilization,
      capacity: selectedPeriod?.capacity,
      status: selectedPeriod?.utilization >= 90 ? 'Critical' : 
              selectedPeriod?.utilization >= 75 ? 'High' : 
              selectedPeriod?.utilization >= 50 ? 'Moderate' : 'Low'
    };
  };

  return (
    <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Calendar" size={20} className="text-primary" />
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              Visitor Flow Heatmap
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Hourly visitor patterns across the week
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {['week', 'month', 'year']?.map((mode) => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
                className="capitalize"
              >
                {mode}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Maximize2"
            iconPosition="left"
          >
            Fullscreen
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-body text-card-foreground">Utilization:</span>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-muted opacity-20 rounded"></div>
                <span className="text-xs font-caption text-muted-foreground">0-25%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-secondary opacity-40 rounded"></div>
                <span className="text-xs font-caption text-muted-foreground">25-50%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-primary opacity-60 rounded"></div>
                <span className="text-xs font-caption text-muted-foreground">50-75%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-warning opacity-80 rounded"></div>
                <span className="text-xs font-caption text-muted-foreground">75-90%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-error opacity-100 rounded"></div>
                <span className="text-xs font-caption text-muted-foreground">90%+</span>
              </div>
            </div>
          </div>
          
          <div className="text-xs font-caption text-muted-foreground">
            Last updated: {new Date()?.toLocaleTimeString('en-IN', { hour12: false })}
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Hour headers */}
            <div className="flex mb-2">
              <div className="w-12"></div>
              {hours?.map((hour) => (
                <div key={hour} className="flex-1 min-w-8 text-center">
                  <span className="text-xs font-mono text-muted-foreground">
                    {hour?.toString()?.padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>

            {/* Heatmap rows */}
            {days?.map((day, dayIndex) => (
              <div key={day} className="flex mb-1">
                <div className="w-12 flex items-center">
                  <span className="text-sm font-body text-card-foreground font-medium">
                    {day}
                  </span>
                </div>
                {hours?.map((hour) => {
                  const cellData = heatmapData?.find(
                    (d) => d?.day === dayIndex && d?.hour === hour
                  );
                  return (
                    <div
                      key={`${day}-${hour}`}
                      className={`flex-1 min-w-8 h-8 m-0.5 rounded cursor-pointer transition-sacred hover:scale-110 ${
                        getIntensityColor(cellData?.utilization || 0)
                      } ${getIntensityOpacity(cellData?.utilization || 0)} ${
                        selectedPeriod?.day === dayIndex && selectedPeriod?.hour === hour
                          ? 'ring-2 ring-accent' :''
                      }`}
                      onClick={() => handleCellClick(cellData)}
                      onMouseEnter={() => handleCellHover(cellData)}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`${day} ${hour}:00 - ${cellData?.visitors || 0} visitors (${Math.round(cellData?.utilization || 0)}%)`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Selected Period Details */}
        {selectedPeriod && (
          <div className="bg-muted rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-heading font-semibold text-card-foreground">
                  Selected Period: {getSelectedPeriodData()?.timeRange}
                </h4>
                <div className="flex items-center space-x-6 mt-2">
                  <div className="flex items-center space-x-2">
                    <Icon name="Users" size={16} className="text-primary" />
                    <span className="text-sm font-body text-card-foreground">
                      {getSelectedPeriodData()?.visitors?.toLocaleString('en-IN')} visitors
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Activity" size={16} className="text-accent" />
                    <span className="text-sm font-body text-card-foreground">
                      {Math.round(getSelectedPeriodData()?.utilization || 0)}% utilization
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="AlertCircle" size={16} className="text-warning" />
                    <span className="text-sm font-body text-card-foreground">
                      Status: {getSelectedPeriodData()?.status}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setSelectedPeriod(null)}
              />
            </div>
          </div>
        )}

        {/* Hover Tooltip */}
        {hoveredCell && (
          <div className="fixed z-50 bg-popover border border-border rounded-lg p-3 sacred-shadow-lg pointer-events-none">
            <div className="text-sm font-body text-popover-foreground">
              <div className="font-semibold">{hoveredCell?.dayName} {hoveredCell?.timeSlot}</div>
              <div className="text-muted-foreground">
                {hoveredCell?.visitors?.toLocaleString('en-IN')} visitors
              </div>
              <div className="text-muted-foreground">
                {Math.round(hoveredCell?.utilization)}% capacity
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeatMapVisualization;