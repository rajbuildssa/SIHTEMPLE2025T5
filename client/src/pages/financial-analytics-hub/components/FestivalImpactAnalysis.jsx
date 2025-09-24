import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const FestivalImpactAnalysis = ({ data }) => {
  const formatCurrency = (value) => `₹${value?.toLocaleString('en-IN') || 0}`;
  
  const getFestivalIcon = (festival) => {
    const icons = {
      'Diwali': 'Sparkles',
      'Holi': 'Palette',
      'Navratri': 'Crown',
      'Dussehra': 'Sword',
      'Janmashtami': 'Star',
      'Karva Chauth': 'Moon',
      'Regular Days': 'Calendar'
    };
    return icons?.[festival] || 'Calendar';
  };

  const getImpactColor = (impact) => {
    if (impact >= 300) return 'text-success';
    if (impact >= 200) return 'text-warning';
    return 'text-muted-foreground';
  };

  const formatTooltip = (value, name, props) => {
    if (name === 'amount') {
      return [formatCurrency(value), 'Donation Amount'];
    }
    return [value, name];
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Festival Impact Analysis</h3>
          <p className="text-sm font-caption text-muted-foreground">Revenue comparison during festivals vs regular days</p>
        </div>
        <Icon name="TrendingUp" size={20} className="text-secondary" />
      </div>
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="festival" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="Inter, sans-serif"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              tickFormatter={formatCurrency}
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
            <Bar 
              dataKey="amount" 
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-sm text-foreground mb-3">Impact Summary</h4>
        {data?.map((item) => (
          <div key={item?.festival} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name={getFestivalIcon(item?.festival)} size={16} className="text-primary" />
              </div>
              <div>
                <span className="font-body font-medium text-sm text-foreground">{item?.festival}</span>
                <div className="text-xs font-caption text-muted-foreground">
                  {item?.duration} days
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-semibold text-sm text-foreground">
                {formatCurrency(item?.amount)}
              </div>
              <div className={`text-xs font-caption ${getImpactColor(item?.impact)}`}>
                {item?.impact}% vs regular
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-success">
              {Math.max(...data?.map(d => d?.impact))}%
            </div>
            <div className="text-xs font-caption text-muted-foreground">Highest Impact</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-heading font-bold text-primary">
              {formatCurrency(data?.reduce((sum, d) => sum + d?.amount, 0))}
            </div>
            <div className="text-xs font-caption text-muted-foreground">Total Festival Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalImpactAnalysis;