import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush, ReferenceLine, Area, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SeasonalTrendsChart = ({ data, filters }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('visitors');
  const [timeRange, setTimeRange] = useState('year');
  const [showFestivals, setShowFestivals] = useState(true);
  const [showWeather, setShowWeather] = useState(true);

  // Generate mock seasonal data
  const generateSeasonalData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const festivals = [
      { month: 2, name: 'Maha Shivratri', impact: 2.5 },
      { month: 3, name: 'Holi', impact: 2.2 },
      { month: 7, name: 'Janmashtami', impact: 3.0 },
      { month: 9, name: 'Navratri', impact: 2.8 },
      { month: 10, name: 'Diwali', impact: 3.2 },
      { month: 11, name: 'Kartik Purnima', impact: 2.0 }
    ];

    return months?.map((month, index) => {
      const baseVisitors = Math.floor(Math.random() * 500) + 800;
      const seasonalMultiplier = 
        index >= 2 && index <= 5 ? 1.3 : // Summer peak
        index >= 9 && index <= 11 ? 1.5 : // Festival season
        0.8; // Monsoon/winter

      const festival = festivals?.find(f => f?.month === index);
      const festivalMultiplier = festival ? festival?.impact : 1;
      
      const visitors = Math.floor(baseVisitors * seasonalMultiplier * festivalMultiplier);
      const weatherImpact = Math.random() * 0.3 - 0.15; // -15% to +15%
      const temperature = 20 + Math.random() * 20; // 20-40°C
      const rainfall = index >= 5 && index <= 8 ? Math.random() * 200 : Math.random() * 50;

      return {
        month,
        monthIndex: index,
        visitors,
        previousYear: Math.floor(visitors * (0.9 + Math.random() * 0.2)),
        average: Math.floor(visitors * 0.95),
        capacity: 2000,
        utilization: (visitors / 2000) * 100,
        temperature,
        rainfall,
        weatherImpact: weatherImpact * 100,
        festival: festival?.name || null,
        festivalImpact: festival ? (festival?.impact - 1) * 100 : 0,
        donations: visitors * (50 + Math.random() * 100), // ₹50-150 per visitor
        satisfaction: 85 + Math.random() * 10 // 85-95%
      };
    });
  };

  useEffect(() => {
    setChartData(generateSeasonalData());
  }, [filters]);

  const metrics = [
    { value: 'visitors', label: 'Visitors', color: '#FF6B35', unit: '' },
    { value: 'utilization', label: 'Utilization', color: '#FFD700', unit: '%' },
    { value: 'donations', label: 'Donations', color: '#8B4513', unit: '₹' },
    { value: 'satisfaction', label: 'Satisfaction', color: '#38A169', unit: '%' }
  ];

  const getCurrentMetric = () => {
    return metrics?.find(m => m?.value === selectedMetric) || metrics?.[0];
  };

  const formatValue = (value, metric) => {
    if (metric === 'donations') {
      return `₹${(value / 1000)?.toFixed(1)}K`;
    }
    if (metric === 'utilization' || metric === 'satisfaction') {
      return `${value?.toFixed(1)}%`;
    }
    return value?.toLocaleString('en-IN');
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 sacred-shadow-lg">
          <h4 className="font-heading font-semibold text-popover-foreground mb-2">
            {label} 2024
          </h4>
          <div className="space-y-2">
            {payload?.map((entry, index) => (
              <div key={index} className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry?.color }}
                  />
                  <span className="text-sm font-body text-popover-foreground">
                    {entry?.name}:
                  </span>
                </div>
                <span className="font-mono text-sm text-popover-foreground">
                  {formatValue(entry?.value, entry?.dataKey)}
                </span>
              </div>
            ))}
            {data?.festival && (
              <div className="pt-2 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Star" size={14} className="text-secondary" />
                  <span className="text-sm font-body text-popover-foreground">
                    {data?.festival}
                  </span>
                </div>
                <div className="text-xs font-caption text-muted-foreground">
                  +{data?.festivalImpact?.toFixed(1)}% festival impact
                </div>
              </div>
            )}
            {showWeather && (
              <div className="pt-2 border-t border-border">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Temp:</span>
                    <span className="ml-1 font-mono">{data?.temperature?.toFixed(1)}°C</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Rain:</span>
                    <span className="ml-1 font-mono">{data?.rainfall?.toFixed(0)}mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const exportChart = (format) => {
    console.log(`Exporting seasonal trends chart in ${format} format`);
  };

  return (
    <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary" />
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              Seasonal Trends Analysis
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              Year-over-year patterns with festival and weather correlations
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => exportChart('png')}
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Maximize2"
            iconPosition="left"
          >
            Fullscreen
          </Button>
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-body text-card-foreground">Metric:</span>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e?.target?.value)}
              className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-body text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {metrics?.map((metric) => (
                <option key={metric?.value} value={metric?.value}>
                  {metric?.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFestivals}
                onChange={(e) => setShowFestivals(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-body text-card-foreground">
                Festival Markers
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showWeather}
                onChange={(e) => setShowWeather(e?.target?.checked)}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
              />
              <span className="text-sm font-body text-card-foreground">
                Weather Overlay
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
          {['month', 'quarter', 'year']?.map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>
      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="month" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              fontFamily="Inter, sans-serif"
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              tickFormatter={(value) => formatValue(value, selectedMetric)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: '14px', 
                fontFamily: 'Inter, sans-serif',
                color: 'var(--color-text-primary)'
              }}
            />
            
            {/* Main metric line */}
            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke={getCurrentMetric()?.color}
              strokeWidth={3}
              dot={{ fill: getCurrentMetric()?.color, strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: getCurrentMetric()?.color, strokeWidth: 2 }}
              name={`Current Year ${getCurrentMetric()?.label}`}
            />
            
            {/* Previous year comparison */}
            <Line
              type="monotone"
              dataKey="previousYear"
              stroke="var(--color-muted-foreground)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Previous Year"
            />
            
            {/* Average line */}
            <Line
              type="monotone"
              dataKey="average"
              stroke="var(--color-accent)"
              strokeWidth={1}
              strokeDasharray="2 2"
              dot={false}
              name="Historical Average"
            />

            {/* Weather impact area (if enabled) */}
            {showWeather && (
              <Area
                type="monotone"
                dataKey="weatherImpact"
                fill="var(--color-secondary)"
                fillOpacity={0.1}
                stroke="none"
                name="Weather Impact"
              />
            )}

            {/* Festival markers */}
            {showFestivals && chartData?.map((item, index) => (
              item?.festival && (
                <ReferenceLine
                  key={`festival-${index}`}
                  x={item?.month}
                  stroke="var(--color-secondary)"
                  strokeDasharray="3 3"
                  label={{
                    value: item?.festival,
                    position: 'top',
                    style: { 
                      fontSize: '10px', 
                      fill: 'var(--color-secondary)',
                      fontFamily: 'Inter, sans-serif'
                    }
                  }}
                />
              )
            ))}
            
            <Brush 
              dataKey="month" 
              height={30} 
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.1}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-card-foreground">
            {formatValue(
              chartData?.reduce((sum, item) => sum + item?.[selectedMetric], 0) / chartData?.length,
              selectedMetric
            )}
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Average {getCurrentMetric()?.label}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-success">
            {formatValue(
              Math.max(...chartData?.map(item => item?.[selectedMetric])),
              selectedMetric
            )}
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Peak {getCurrentMetric()?.label}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-warning">
            {chartData?.filter(item => item?.festival)?.length}
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Festival Months
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-primary">
            {((chartData?.reduce((sum, item) => sum + item?.[selectedMetric], 0) - 
             chartData?.reduce((sum, item) => sum + item?.previousYear, 0)) /
            chartData?.reduce((sum, item) => sum + item?.previousYear, 0) * 100)?.toFixed(1)}%
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            YoY Growth
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeasonalTrendsChart;