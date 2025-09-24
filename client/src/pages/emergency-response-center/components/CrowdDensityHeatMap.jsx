import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CrowdDensityHeatMap = ({ zones, onZoneSelect, onCapacityAlert }) => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [viewMode, setViewMode] = useState('density'); // density, capacity, flow

  const getDensityColor = (density, capacity) => {
    const percentage = (density / capacity) * 100;
    if (percentage >= 90) return 'bg-error text-error-foreground';
    if (percentage >= 75) return 'bg-warning text-warning-foreground';
    if (percentage >= 50) return 'bg-secondary text-secondary-foreground';
    return 'bg-success/20 text-success';
  };

  const getDensityLevel = (density, capacity) => {
    const percentage = (density / capacity) * 100;
    if (percentage >= 90) return 'Critical';
    if (percentage >= 75) return 'High';
    if (percentage >= 50) return 'Moderate';
    return 'Low';
  };

  const getFlowDirection = (flow) => {
    if (flow > 10) return { icon: 'ArrowUp', color: 'text-success', label: 'Increasing' };
    if (flow < -10) return { icon: 'ArrowDown', color: 'text-primary', label: 'Decreasing' };
    return { icon: 'Minus', color: 'text-muted-foreground', label: 'Stable' };
  };

  const formatPercentage = (current, total) => {
    return Math.round((current / total) * 100);
  };

  const getZoneIcon = (type) => {
    switch (type) {
      case 'entrance': return 'DoorOpen';
      case 'main-hall': return 'Building';
      case 'courtyard': return 'TreePine';
      case 'parking': return 'Car';
      case 'queue': return 'Users';
      default: return 'MapPin';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg sacred-shadow-sm">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="Map" size={20} className="text-primary" />
            <h3 className="font-heading font-semibold text-lg">Crowd Density Heat Map</h3>
            <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-mono">
              {zones?.length} Zones
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e?.target?.value)}
              className="px-3 py-1 border border-border rounded-md text-sm font-caption bg-background"
            >
              <option value="density">Density View</option>
              <option value="capacity">Capacity View</option>
              <option value="flow">Flow View</option>
            </select>
            
            <Button variant="outline" size="sm" iconName="RefreshCw" iconPosition="left">
              Refresh
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 text-xs font-caption text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-success/20 rounded"></div>
            <span>Low (&lt;50%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-secondary rounded"></div>
            <span>Moderate (50-75%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-warning rounded"></div>
            <span>High (75-90%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-error rounded"></div>
            <span>Critical (&gt;90%)</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {zones?.map((zone) => {
            const flowInfo = getFlowDirection(zone?.flow);
            const percentage = formatPercentage(zone?.currentDensity, zone?.maxCapacity);
            
            return (
              <div
                key={zone?.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-hover hover-lift ${
                  selectedZone?.id === zone?.id ? 'ring-2 ring-primary' : ''
                } ${getDensityColor(zone?.currentDensity, zone?.maxCapacity)}`}
                onClick={() => {
                  setSelectedZone(zone);
                  onZoneSelect?.(zone);
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Icon name={getZoneIcon(zone?.type)} size={16} />
                    <span className="font-heading font-medium text-sm truncate">
                      {zone?.name}
                    </span>
                  </div>
                  
                  {percentage >= 90 && (
                    <Icon name="AlertTriangle" size={14} className="text-error breathing-animation" />
                  )}
                </div>
                {viewMode === 'density' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-caption">Current</span>
                      <span className="font-mono text-sm font-bold">
                        {zone?.currentDensity?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-caption">Capacity</span>
                      <span className="font-mono text-sm">
                        {zone?.maxCapacity?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="w-full bg-background/50 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          percentage >= 90 ? 'bg-error' :
                          percentage >= 75 ? 'bg-warning' :
                          percentage >= 50 ? 'bg-secondary' : 'bg-success'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-caption">Utilization</span>
                      <span className="font-mono text-sm font-bold">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )}
                {viewMode === 'capacity' && (
                  <div className="space-y-2">
                    <div className="text-center">
                      <div className="text-2xl font-heading font-bold mb-1">
                        {percentage}%
                      </div>
                      <div className="text-xs font-caption">
                        {getDensityLevel(zone?.currentDensity, zone?.maxCapacity)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Available</span>
                      <span>{(zone?.maxCapacity - zone?.currentDensity)?.toLocaleString()}</span>
                    </div>
                  </div>
                )}
                {viewMode === 'flow' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center space-x-2">
                      <Icon name={flowInfo?.icon} size={20} className={flowInfo?.color} />
                      <span className="font-heading font-medium text-sm">
                        {flowInfo?.label}
                      </span>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-mono font-bold">
                        {Math.abs(zone?.flow)}/min
                      </div>
                      <div className="text-xs font-caption text-muted-foreground">
                        {zone?.flow > 0 ? 'Incoming' : zone?.flow < 0 ? 'Outgoing' : 'No Change'}
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs font-caption text-muted-foreground">
                    <span>Last Update</span>
                    <span>{new Date(zone.lastUpdate)?.toLocaleTimeString('en-US', { hour12: false })}</span>
                  </div>
                </div>
                {zone?.alerts && zone?.alerts?.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {zone?.alerts?.map((alert, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-error/20 text-error rounded text-xs font-caption"
                        >
                          {alert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {zones?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="MapPin" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h4 className="font-heading font-medium text-lg mb-2">No Zone Data</h4>
            <p className="text-muted-foreground font-caption">Crowd density monitoring is currently unavailable</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg font-heading font-bold text-success">
              {zones?.filter(z => formatPercentage(z?.currentDensity, z?.maxCapacity) < 50)?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Low Density</div>
          </div>
          <div>
            <div className="text-lg font-heading font-bold text-secondary">
              {zones?.filter(z => {
                const p = formatPercentage(z?.currentDensity, z?.maxCapacity);
                return p >= 50 && p < 75;
              })?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Moderate</div>
          </div>
          <div>
            <div className="text-lg font-heading font-bold text-warning">
              {zones?.filter(z => {
                const p = formatPercentage(z?.currentDensity, z?.maxCapacity);
                return p >= 75 && p < 90;
              })?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">High Density</div>
          </div>
          <div>
            <div className="text-lg font-heading font-bold text-error">
              {zones?.filter(z => formatPercentage(z?.currentDensity, z?.maxCapacity) >= 90)?.length}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Critical</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdDensityHeatMap;