import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsStrip = ({ metrics }) => {
  const getMetricIcon = (type) => {
    switch (type) {
      case 'visitors': return 'Users';
      case 'peak': return 'TrendingUp';
      case 'density': return 'Activity';
      case 'bottleneck': return 'AlertTriangle';
      default: return 'BarChart3';
    }
  };

  const getMetricColor = (type, value, threshold) => {
    if (type === 'density') {
      if (value >= 90) return 'text-error';
      if (value >= 75) return 'text-warning';
      return 'text-success';
    }
    if (type === 'bottleneck') {
      return value > 0 ? 'text-error' : 'text-success';
    }
    return 'text-primary';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics?.map((metric) => (
        <div key={metric?.id} className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
                <Icon 
                  name={getMetricIcon(metric?.type)} 
                  size={20} 
                  className={getMetricColor(metric?.type, metric?.value, metric?.threshold)}
                />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-sm text-card-foreground">
                  {metric?.title}
                </h3>
                <p className="text-xs font-caption text-muted-foreground">
                  {metric?.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Icon 
                name={getTrendIcon(metric?.trend)} 
                size={16} 
                className={getTrendColor(metric?.trend)}
              />
              <span className={`text-sm font-mono ${getTrendColor(metric?.trend)}`}>
                {Math.abs(metric?.trend)}%
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-heading font-bold text-card-foreground">
                {metric?.value?.toLocaleString('en-IN')}
              </span>
              <span className="text-sm font-caption text-muted-foreground">
                {metric?.unit}
              </span>
            </div>
            
            {metric?.type === 'density' && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-sacred ${
                    metric?.value >= 90 ? 'bg-error' : 
                    metric?.value >= 75 ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${Math.min(metric?.value, 100)}%` }}
                />
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs font-caption">
              <span className="text-muted-foreground">
                {metric?.comparison}
              </span>
              <span className="text-accent font-medium">
                {metric?.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsStrip;