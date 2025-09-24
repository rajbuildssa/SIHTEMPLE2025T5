import React from 'react';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data, selectedPeriod }) => {
  const formatCurrency = (value) => `₹${value?.toLocaleString('en-IN') || 0}`;
  
  const formatTooltip = (value, name) => {
    if (name === 'donations') return [formatCurrency(value), 'Donations'];
    if (name === 'visitors') return [value?.toLocaleString('en-IN') || 0, 'Visitors'];
    return [value, name];
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Revenue & Visitor Correlation</h3>
          <p className="text-sm font-caption text-muted-foreground">
            Donation trends with visitor count analysis - {selectedPeriod}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-sm"></div>
            <span className="text-xs font-caption text-muted-foreground">Donations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-sm"></div>
            <span className="text-xs font-caption text-muted-foreground">Visitors</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              yAxisId="donations"
              orientation="left"
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              tickFormatter={formatCurrency}
            />
            <YAxis 
              yAxisId="visitors"
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
            <Legend />
            <Bar 
              yAxisId="donations"
              dataKey="donations" 
              fill="var(--color-primary)" 
              name="Donations (₹)"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="visitors"
              type="monotone" 
              dataKey="visitors" 
              stroke="var(--color-secondary)" 
              strokeWidth={3}
              name="Visitors"
              dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart;