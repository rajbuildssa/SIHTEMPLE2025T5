import React from 'react';
import Icon from '../../../components/AppIcon';

const KPIMetricCard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  color = 'primary',
  isLive = false,
  sparklineData = [],
  threshold = null
}) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'text-primary bg-primary/10 border-primary/20',
      success: 'text-success bg-success/10 border-success/20',
      warning: 'text-warning bg-warning/10 border-warning/20',
      error: 'text-error bg-error/10 border-error/20',
      accent: 'text-accent bg-accent/10 border-accent/20'
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'TrendingUp';
    if (trend === 'down') return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-success';
    if (trend === 'down') return 'text-error';
    return 'text-muted-foreground';
  };

  const getThresholdStatus = () => {
    if (!threshold || !value) return null;
    const percentage = (parseFloat(value?.toString()?.replace(/,/g, '')) / threshold?.max) * 100;
    
    if (percentage >= 90) return { status: 'critical', color: 'error' };
    if (percentage >= 75) return { status: 'warning', color: 'warning' };
    return { status: 'normal', color: 'success' };
  };

  const thresholdStatus = getThresholdStatus();

  return (
    <div className={`bg-card border rounded-lg p-6 sacred-shadow-sm transition-hover hover-lift ${
      thresholdStatus ? getColorClasses(thresholdStatus?.color) : getColorClasses(color)
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            thresholdStatus ? `bg-${thresholdStatus?.color}/20` : `bg-${color}/20`
          }`}>
            <Icon 
              name={icon} 
              size={20} 
              className={thresholdStatus ? `text-${thresholdStatus?.color}` : `text-${color}`}
            />
          </div>
          <div>
            <h3 className="font-heading font-medium text-sm text-card-foreground">
              {title}
            </h3>
            {isLive && (
              <div className="flex items-center space-x-1 mt-1">
                <div className="w-2 h-2 bg-success rounded-full breathing-animation" />
                <span className="text-xs font-caption text-success">Live</span>
              </div>
            )}
          </div>
        </div>
        
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            <Icon name={getTrendIcon()} size={14} />
            <span className="text-xs font-mono font-medium">
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl font-heading font-bold text-card-foreground">
            {value}
          </span>
          {unit && (
            <span className="text-sm font-caption text-muted-foreground">
              {unit}
            </span>
          )}
        </div>

        {threshold && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-caption text-muted-foreground">
              <span>Capacity</span>
              <span>{threshold?.current}/{threshold?.max}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-sacred bg-${thresholdStatus?.color || 'primary'}`}
                style={{ 
                  width: `${Math.min((threshold?.current / threshold?.max) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {sparklineData?.length > 0 && (
          <div className="mt-3">
            <div className="flex items-end space-x-1 h-8">
              {sparklineData?.slice(-12)?.map((point, index) => (
                <div
                  key={index}
                  className={`w-2 bg-${color}/40 rounded-t transition-hover`}
                  style={{ 
                    height: `${(point / Math.max(...sparklineData)) * 100}%`,
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIMetricCard;