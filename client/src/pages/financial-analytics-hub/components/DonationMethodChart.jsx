import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Icon from '../../../components/AppIcon';

const DonationMethodChart = ({ data }) => {
  const COLORS = [
    'var(--color-primary)',
    'var(--color-secondary)', 
    'var(--color-accent)',
    'var(--color-success)',
    'var(--color-warning)'
  ];

  const getMethodIcon = (method) => {
    const icons = {
      'Digital Payment': 'Smartphone',
      'Cash': 'Banknote',
      'Bank Transfer': 'CreditCard',
      'Cheque': 'FileText',
      'Other': 'MoreHorizontal'
    };
    return icons?.[method] || 'Circle';
  };

  const formatTooltip = (value, name) => [
    `₹${value?.toLocaleString('en-IN')}`,
    name
  ];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for slices less than 5%
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
        fontFamily="JetBrains Mono, monospace"
      >
        {`${(percent * 100)?.toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Donation Methods</h3>
          <p className="text-sm font-caption text-muted-foreground">Payment channel distribution</p>
        </div>
        <Icon name="PieChart" size={20} className="text-primary" />
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              stroke="var(--color-background)"
              strokeWidth={2}
            >
              {data?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={formatTooltip}
              contentStyle={{ 
                backgroundColor: 'var(--color-popover)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-lg)'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-6 space-y-3">
        {data?.map((item, index) => (
          <div key={item?.method} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
              />
              <div className="flex items-center space-x-2">
                <Icon name={getMethodIcon(item?.method)} size={16} className="text-muted-foreground" />
                <span className="text-sm font-body text-foreground">{item?.method}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-sm font-mono font-semibold text-foreground">
                ₹{item?.amount?.toLocaleString('en-IN')}
              </span>
              <div className="text-xs font-caption text-muted-foreground">
                {((item?.amount / data?.reduce((sum, d) => sum + d?.amount, 0)) * 100)?.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationMethodChart;