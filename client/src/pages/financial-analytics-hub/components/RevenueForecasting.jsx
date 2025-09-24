import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';

const RevenueForecasting = ({ historicalData, forecastData, targets }) => {
  const formatCurrency = (value) => `₹${value?.toLocaleString('en-IN') || 0}`;
  
  const combinedData = [...historicalData, ...forecastData];
  
  const formatTooltip = (value, name) => {
    if (name === 'historical') return [formatCurrency(value), 'Historical Revenue'];
    if (name === 'forecast') return [formatCurrency(value), 'Forecasted Revenue'];
    if (name === 'target') return [formatCurrency(value), 'Target Revenue'];
    return [formatCurrency(value), name];
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  const calculateVariance = (forecast, target) => {
    return ((forecast - target) / target * 100)?.toFixed(1);
  };

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Revenue Forecasting</h3>
          <p className="text-sm font-caption text-muted-foreground">ML-powered predictions for upcoming periods</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-sm"></div>
          <span className="text-xs font-caption text-muted-foreground mr-3">Historical</span>
          <div className="w-3 h-3 bg-secondary rounded-sm"></div>
          <span className="text-xs font-caption text-muted-foreground mr-3">Forecast</span>
          <div className="w-3 h-3 bg-accent rounded-sm"></div>
          <span className="text-xs font-caption text-muted-foreground">Target</span>
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="Inter, sans-serif"
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
            <ReferenceLine 
              x={historicalData?.[historicalData?.length - 1]?.period} 
              stroke="var(--color-border)" 
              strokeDasharray="2 2" 
            />
            <Line 
              type="monotone" 
              dataKey="historical" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              name="historical"
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="forecast" 
              stroke="var(--color-secondary)" 
              strokeWidth={3}
              strokeDasharray="8 4"
              name="forecast"
              dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              connectNulls={false}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="var(--color-accent)" 
              strokeWidth={2}
              strokeDasharray="4 4"
              name="target"
              dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 3 }}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-heading font-bold text-primary">
            {formatCurrency(forecastData?.reduce((sum, d) => sum + (d?.forecast || 0), 0))}
          </div>
          <div className="text-xs font-caption text-muted-foreground">Forecasted Revenue</div>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className="text-2xl font-heading font-bold text-accent">
            {formatCurrency(targets?.annual)}
          </div>
          <div className="text-xs font-caption text-muted-foreground">Annual Target</div>
        </div>
        <div className="text-center p-4 bg-muted/30 rounded-lg">
          <div className={`text-2xl font-heading font-bold ${getConfidenceColor(targets?.confidence)}`}>
            {targets?.confidence}%
          </div>
          <div className="text-xs font-caption text-muted-foreground">Confidence Level</div>
        </div>
      </div>
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-sm text-foreground">Forecast Breakdown</h4>
        {forecastData?.map((item) => {
          const variance = calculateVariance(item?.forecast, item?.target);
          return (
            <div key={item?.period} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={16} className="text-secondary" />
                </div>
                <div>
                  <span className="font-body font-medium text-sm text-foreground">{item?.period}</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs font-caption ${getConfidenceColor(item?.confidence)}`}>
                      {item?.confidence}% confidence
                    </span>
                    <span className="text-xs font-caption text-muted-foreground">•</span>
                    <span className="text-xs font-caption text-muted-foreground">
                      {item?.factors?.join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono font-semibold text-sm text-foreground">
                  {formatCurrency(item?.forecast)}
                </div>
                <div className={`text-xs font-mono ${variance >= 0 ? 'text-success' : 'text-error'}`}>
                  {variance >= 0 ? '+' : ''}{variance}% vs target
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Brain" size={16} className="text-primary" />
            <span className="text-sm font-caption text-muted-foreground">
              Model accuracy: {targets?.modelAccuracy}% | Last updated: {new Date()?.toLocaleDateString('en-IN')}
            </span>
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Next update in 24 hours
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueForecasting;