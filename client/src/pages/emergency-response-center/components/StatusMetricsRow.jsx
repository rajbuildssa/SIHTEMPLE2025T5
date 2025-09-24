import React from 'react';
import Icon from '../../../components/AppIcon';

const StatusMetricsRow = ({ metrics }) => {
  const MetricCard = ({ title, value, subtitle, icon, status, trend, target }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'good': return 'text-success';
        case 'warning': return 'text-warning';
        case 'critical': return 'text-error';
        default: return 'text-muted-foreground';
      }
    };

    const getTrendIcon = (trend) => {
      if (trend > 0) return 'TrendingUp';
      if (trend < 0) return 'TrendingDown';
      return 'Minus';
    };

    return (
      <div className="bg-card border border-border rounded-lg p-4 sacred-shadow-sm hover-lift transition-hover">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name={icon} size={16} className={getStatusColor(status)} />
            <span className="text-sm font-caption text-muted-foreground">{title}</span>
          </div>
          {trend !== undefined && (
            <Icon name={getTrendIcon(trend)} size={14} className={getStatusColor(status)} />
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-heading font-bold ${getStatusColor(status)}`}>
              {value}
            </span>
            {target && (
              <span className="text-sm font-mono text-muted-foreground">
                / {target}
              </span>
            )}
          </div>
          
          {subtitle && (
            <p className="text-xs font-caption text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
      <MetricCard
        title="Active Incidents"
        value={metrics?.activeIncidents?.total}
        subtitle={`${metrics?.activeIncidents?.critical} critical, ${metrics?.activeIncidents?.high} high priority`}
        icon="AlertCircle"
        status={metrics?.activeIncidents?.critical > 0 ? 'critical' : metrics?.activeIncidents?.high > 2 ? 'warning' : 'good'}
        trend={metrics?.activeIncidents?.trend}
        target={undefined}
      />
      <MetricCard
        title="Response Time"
        value={`${metrics?.responseTime?.average}m`}
        subtitle={`Target: ${metrics?.responseTime?.target}m`}
        icon="Clock"
        status={metrics?.responseTime?.average > metrics?.responseTime?.target ? 'warning' : 'good'}
        target={`${metrics?.responseTime?.target}m`}
        trend={metrics?.responseTime?.trend}
      />
      <MetricCard
        title="Staff Deployed"
        value={`${metrics?.staffDeployment?.active}/${metrics?.staffDeployment?.total}`}
        subtitle={`${metrics?.staffDeployment?.available} available`}
        icon="Users"
        status={metrics?.staffDeployment?.available < 5 ? 'warning' : 'good'}
        trend={metrics?.staffDeployment?.trend}
        target={undefined}
      />
      <MetricCard
        title="Crowd Safety"
        value={`${metrics?.crowdSafety?.score}%`}
        subtitle={`${metrics?.crowdSafety?.zones} zones monitored`}
        icon="Shield"
        status={metrics?.crowdSafety?.score < 70 ? 'critical' : metrics?.crowdSafety?.score < 85 ? 'warning' : 'good'}
        trend={metrics?.crowdSafety?.trend}
        target={undefined}
      />
      <MetricCard
        title="Equipment Status"
        value={`${metrics?.equipment?.operational}/${metrics?.equipment?.total}`}
        subtitle={`${metrics?.equipment?.maintenance} in maintenance`}
        icon="Tool"
        status={metrics?.equipment?.operational < metrics?.equipment?.total * 0.8 ? 'warning' : 'good'}
        trend={metrics?.equipment?.trend}
        target={undefined}
      />
      <MetricCard
        title="Communication"
        value={metrics?.communication?.status}
        subtitle={`${metrics?.communication?.channels} channels active`}
        icon="Radio"
        status={metrics?.communication?.status === 'Operational' ? 'good' : 'critical'}
        trend={metrics?.communication?.trend}
        target={undefined}
      />
    </div>
  );
};

export default StatusMetricsRow;