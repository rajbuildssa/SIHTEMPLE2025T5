import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '../../../components/AppIcon';

const SeasonalTrendAnalysis = ({ data, selectedYear, onYearChange }) => {
  const formatCurrency = (value) => `₹${value?.toLocaleString('en-IN') || 0}`;
  
  const formatTooltip = (value, name, props) => {
    const year = props?.payload?.year;
    return [formatCurrency(value), `${name} ${year}`];
  };

  const years = [2024, 2023, 2022];
  
  const getSeasonIcon = (month) => {
    const seasonIcons = {
      'Jan': 'Snowflake', 'Feb': 'Snowflake', 'Mar': 'Flower',
      'Apr': 'Flower', 'May': 'Sun', 'Jun': 'Sun',
      'Jul': 'Cloud', 'Aug': 'Cloud', 'Sep': 'Leaf',
      'Oct': 'Leaf', 'Nov': 'Wind', 'Dec': 'Snowflake'
    };
    return seasonIcons?.[month] || 'Calendar';
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return 0;
    return ((current - previous) / previous * 100)?.toFixed(1);
  };

  const currentYearData = data?.filter(d => d?.year === selectedYear);
  const previousYearData = data?.filter(d => d?.year === selectedYear - 1);

  return (
    <div className="bg-card p-6 rounded-lg border border-border sacred-shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-heading font-semibold text-foreground">Seasonal Trend Analysis</h3>
          <p className="text-sm font-caption text-muted-foreground">Year-over-year donation patterns</p>
        </div>
        <div className="flex items-center space-x-3">
          <select 
            value={selectedYear}
            onChange={(e) => onYearChange(parseInt(e?.target?.value))}
            className="px-3 py-1 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {years?.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <Icon name="TrendingUp" size={20} className="text-primary" />
        </div>
      </div>
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={currentYearData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
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
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="var(--color-primary)" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorDonations)"
              name={selectedYear}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {['Q1', 'Q2', 'Q3', 'Q4']?.map((quarter, index) => {
          const quarterData = currentYearData?.slice(index * 3, (index + 1) * 3);
          const quarterTotal = quarterData?.reduce((sum, d) => sum + d?.amount, 0);
          const prevQuarterData = previousYearData?.slice(index * 3, (index + 1) * 3);
          const prevQuarterTotal = prevQuarterData?.reduce((sum, d) => sum + d?.amount, 0);
          const growth = calculateGrowth(quarterTotal, prevQuarterTotal);
          
          return (
            <div key={quarter} className="text-center p-3 bg-muted/30 rounded-lg">
              <div className="text-lg font-heading font-bold text-foreground">
                {formatCurrency(quarterTotal)}
              </div>
              <div className="text-xs font-caption text-muted-foreground mb-1">{quarter} {selectedYear}</div>
              <div className={`text-xs font-mono ${growth >= 0 ? 'text-success' : 'text-error'}`}>
                {growth >= 0 ? '+' : ''}{growth}%
              </div>
            </div>
          );
        })}
      </div>
      <div className="space-y-3">
        <h4 className="font-heading font-medium text-sm text-foreground">Monthly Insights</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentYearData?.map((monthData, index) => {
            const prevMonthData = previousYearData?.[index];
            const growth = calculateGrowth(monthData?.amount, prevMonthData?.amount);
            
            return (
              <div key={monthData?.month} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name={getSeasonIcon(monthData?.month)} size={16} className="text-primary" />
                  </div>
                  <div>
                    <span className="font-body font-medium text-sm text-foreground">{monthData?.month} {selectedYear}</span>
                    <div className="text-xs font-caption text-muted-foreground">
                      {monthData?.festivalEvents} festivals
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-semibold text-sm text-foreground">
                    {formatCurrency(monthData?.amount)}
                  </div>
                  <div className={`text-xs font-mono ${growth >= 0 ? 'text-success' : 'text-error'}`}>
                    {growth >= 0 ? '+' : ''}{growth}% YoY
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SeasonalTrendAnalysis;