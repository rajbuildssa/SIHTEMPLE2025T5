import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const RecurringDonationsMetrics = ({ data, summary }) => {
  const formatCurrency = (value) => `₹${value?.toLocaleString('en-IN') || 0}`;
  
  const formatTooltip = (value, name) => {
    if (name === 'amount') return [formatCurrency(value), 'Monthly Amount'];
    if (name === 'subscribers') return [value, 'Active Subscribers'];
    return [value, name];
  };

  const getFrequencyIcon = (frequency) => {
    const icons = {
      'Monthly': 'Calendar',
      'Weekly': 'Clock',
      'Yearly': 'CalendarDays'
    };
    return icons?.[frequency] || 'Repeat';
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Recurring Donations</h3>
          <p className="text-sm font-caption text-muted-foreground">Subscription-based donation trends</p>
        </div>
        <Icon name="Repeat" size={20} className="text-accent" />
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-xl font-heading font-bold text-primary">
            {summary?.totalSubscribers}
          </div>
          <div className="text-xs font-caption text-muted-foreground">Active Subscribers</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-xl font-heading font-bold text-success">
            {formatCurrency(summary?.monthlyRecurring)}
          </div>
          <div className="text-xs font-caption text-muted-foreground">Monthly Recurring</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-xl font-heading font-bold text-accent">
            {summary?.retentionRate}%
          </div>
          <div className="text-xs font-caption text-muted-foreground">Retention Rate</div>
        </div>
      </div>
      <div className="h-48 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              yAxisId="amount"
              orientation="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="subscribers"
              orientation="right"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
            />
            <Tooltip 
              formatter={formatTooltip}
              labelStyle={{ color: 'var(--color-foreground)', fontFamily: 'Inter, sans-serif' }}
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
            <Line 
              yAxisId="amount"
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              name="amount"
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
            />
            <Line 
              yAxisId="subscribers"
              type="monotone" 
              dataKey="subscribers" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="subscribers"
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-sm text-foreground">Subscription Breakdown</h4>
        {summary?.frequencyBreakdown?.map((item) => (
          <div key={item?.frequency} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <Icon name={getFrequencyIcon(item?.frequency)} size={16} className="text-accent" />
              </div>
              <div>
                <span className="font-body font-medium text-sm text-foreground">{item?.frequency}</span>
                <div className="text-xs font-caption text-muted-foreground">
                  {item?.subscribers} subscribers
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-sm text-foreground">
                {formatCurrency(item?.amount)}
              </div>
              <div className="text-xs font-caption text-muted-foreground">
                Avg per donor
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-sm">
          <span className="font-caption text-muted-foreground">Projected Annual Recurring</span>
          <span className="font-mono font-semibold text-success">
            {formatCurrency(summary?.monthlyRecurring * 12)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecurringDonationsMetrics;