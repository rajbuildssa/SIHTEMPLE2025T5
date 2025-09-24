import React from 'react';
import Icon from '../../../components/AppIcon';

const FinancialKPICard = ({ title, value, change, changeType, icon, currency = '₹' }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm hover-lift transition-sacred">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name={icon} size={24} className="text-primary" />
        </div>
        <div className={`flex items-center space-x-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-sm font-mono font-medium">{change}</span>
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-sm font-caption text-muted-foreground">{title}</h3>
        <p className="text-2xl font-heading font-bold text-foreground">
          {currency}{value}
        </p>
      </div>
    </div>
  );
};

export default FinancialKPICard;