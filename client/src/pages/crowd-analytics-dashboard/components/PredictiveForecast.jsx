import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart, ReferenceLine } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictiveForecast = ({ forecastData, onScenarioChange }) => {
  const [selectedScenario, setSelectedScenario] = useState('normal');
  const [forecastHorizon, setForecastHorizon] = useState(24);
  const [uncertaintyBands, setUncertaintyBands] = useState(true);
  const [realTimeData, setRealTimeData] = useState([]);

  // Generate mock forecast data
  const generateForecastData = () => {
    const now = new Date();
    const data = [];
    
    for (let i = 0; i < forecastHorizon; i++) {
      const time = new Date(now.getTime() + i * 60 * 60 * 1000); // Each hour
      const hour = time?.getHours();
      
      // Base visitor pattern (higher during day, lower at night)
      let baseVisitors = 200;
      if (hour >= 6 && hour <= 10) baseVisitors = 800; // Morning peak
      else if (hour >= 11 && hour <= 16) baseVisitors = 600; // Afternoon
      else if (hour >= 17 && hour <= 21) baseVisitors = 900; // Evening peak
      else if (hour >= 22 || hour <= 5) baseVisitors = 150; // Night
      
      // Scenario adjustments
      let scenarioMultiplier = 1;
      switch (selectedScenario) {
        case 'festival':
          scenarioMultiplier = 2.5;
          break;
        case 'weather_disruption':
          scenarioMultiplier = 0.4;
          break;
        case 'special_event':
          scenarioMultiplier = 3.2;
          break;
        case 'maintenance':
          scenarioMultiplier = 0.1;
          break;
        default:
          scenarioMultiplier = 1;
      }
      
      const predictedVisitors = Math.floor(baseVisitors * scenarioMultiplier * (0.8 + Math.random() * 0.4));
      const uncertainty = predictedVisitors * 0.15; // 15% uncertainty
      
      data?.push({
        time: time?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
        hour: i,
        predicted: predictedVisitors,
        upperBound: Math.floor(predictedVisitors + uncertainty),
        lowerBound: Math.floor(Math.max(0, predictedVisitors - uncertainty)),
        confidence: 85 + Math.random() * 10,
        capacity: 2000,
        utilization: (predictedVisitors / 2000) * 100,
        actualVisitors: i < 2 ? Math.floor(predictedVisitors * (0.9 + Math.random() * 0.2)) : null, // Only show actual for past hours
        weatherImpact: (Math.random() - 0.5) * 20, // -10% to +10%
        eventImpact: selectedScenario !== 'normal' ? (scenarioMultiplier - 1) * 100 : 0
      });
    }
    
    return data;
  };

  const [chartData, setChartData] = useState(generateForecastData());

  useEffect(() => {
    setChartData(generateForecastData());
    onScenarioChange && onScenarioChange(selectedScenario);
  }, [selectedScenario, forecastHorizon]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const updated = [...prev];
        // Update first few hours with "actual" data
        updated?.slice(0, 2)?.forEach(item => {
          if (item?.actualVisitors === null) {
            item.actualVisitors = Math.floor(item?.predicted * (0.9 + Math.random() * 0.2));
          }
        });
        return updated;
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const scenarios = [
    {
      id: 'normal',
      name: 'Normal Operations',
      description: 'Standard visitor patterns',
      icon: 'Activity',
      color: 'text-primary',
      multiplier: 1.0
    },
    {
      id: 'festival',
      name: 'Festival Day',
      description: 'Major religious festival',
      icon: 'Star',
      color: 'text-secondary',
      multiplier: 2.5
    },
    {
      id: 'weather_disruption',
      name: 'Weather Impact',
      description: 'Heavy rain or extreme weather',
      icon: 'Cloud',
      color: 'text-warning',
      multiplier: 0.4
    },
    {
      id: 'special_event',
      name: 'Special Event',
      description: 'VIP visit or special ceremony',
      icon: 'Crown',
      color: 'text-accent',
      multiplier: 3.2
    },
    {
      id: 'maintenance',
      name: 'Maintenance Mode',
      description: 'Planned maintenance closure',
      icon: 'Settings',
      color: 'text-error',
      multiplier: 0.1
    }
  ];

  const getCurrentScenario = () => {
    return scenarios?.find(s => s?.id === selectedScenario) || scenarios?.[0];
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-success';
    if (confidence >= 80) return 'text-warning';
    return 'text-error';
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 sacred-shadow-lg">
          <h4 className="font-heading font-semibold text-popover-foreground mb-2">
            {label}
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm font-body text-popover-foreground">Predicted:</span>
              <span className="font-mono text-sm text-popover-foreground">
                {data?.predicted?.toLocaleString('en-IN')}
              </span>
            </div>
            {data?.actualVisitors && (
              <div className="flex items-center justify-between space-x-4">
                <span className="text-sm font-body text-popover-foreground">Actual:</span>
                <span className="font-mono text-sm text-success">
                  {data?.actualVisitors?.toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm font-body text-popover-foreground">Confidence:</span>
              <span className={`font-mono text-sm ${getConfidenceColor(data?.confidence)}`}>
                {data?.confidence?.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <span className="text-sm font-body text-popover-foreground">Utilization:</span>
              <span className="font-mono text-sm text-popover-foreground">
                {data?.utilization?.toFixed(1)}%
              </span>
            </div>
            {uncertaintyBands && (
              <div className="pt-2 border-t border-border">
                <div className="text-xs font-caption text-muted-foreground">
                  Range: {data?.lowerBound?.toLocaleString('en-IN')} - {data?.upperBound?.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const exportForecast = () => {
    console.log('Exporting forecast data...');
  };

  const refreshForecast = () => {
    setChartData(generateForecastData());
  };

  return (
    <div className="bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon name="Zap" size={20} className="text-primary" />
          <div>
            <h3 className="font-heading font-semibold text-lg text-card-foreground">
              24-Hour Predictive Forecast
            </h3>
            <p className="text-sm font-caption text-muted-foreground">
              ML-powered visitor predictions with uncertainty bands
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconPosition="left"
            onClick={refreshForecast}
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={exportForecast}
          >
            Export
          </Button>
        </div>
      </div>
      {/* Scenario Selection */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <Icon name="Settings" size={16} className="text-accent" />
          <h4 className="font-heading font-medium text-card-foreground">
            Prediction Scenario
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {scenarios?.map((scenario) => (
            <div
              key={scenario?.id}
              className={`p-3 rounded-lg border cursor-pointer transition-sacred hover-lift ${
                selectedScenario === scenario?.id
                  ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }`}
              onClick={() => setSelectedScenario(scenario?.id)}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Icon name={scenario?.icon} size={16} className={scenario?.color} />
                <span className="font-heading font-medium text-sm text-card-foreground">
                  {scenario?.name}
                </span>
              </div>
              <p className="text-xs font-caption text-muted-foreground">
                {scenario?.description}
              </p>
              <div className="mt-2 text-xs font-mono text-accent">
                {scenario?.multiplier}x impact
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-body text-card-foreground">Horizon:</span>
            <select
              value={forecastHorizon}
              onChange={(e) => setForecastHorizon(parseInt(e?.target?.value))}
              className="px-3 py-1 bg-background border border-border rounded-lg text-sm font-body text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={12}>12 Hours</option>
              <option value={24}>24 Hours</option>
              <option value={48}>48 Hours</option>
              <option value={72}>72 Hours</option>
              <option value={168}>1 Week</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uncertaintyBands}
              onChange={(e) => setUncertaintyBands(e?.target?.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
            />
            <span className="text-sm font-body text-card-foreground">
              Uncertainty Bands
            </span>
          </label>
        </div>

        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Clock" size={16} className="text-muted-foreground" />
          <span className="font-caption text-muted-foreground">
            Updated: {new Date()?.toLocaleTimeString('en-IN', { hour12: false })}
          </span>
        </div>
      </div>
      {/* Chart */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="time" 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="var(--color-text-secondary)"
              fontSize={12}
              fontFamily="JetBrains Mono, monospace"
              tickFormatter={(value) => value?.toLocaleString('en-IN')}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                fontSize: '14px', 
                fontFamily: 'Inter, sans-serif',
                color: 'var(--color-text-primary)'
              }}
            />
            
            {/* Uncertainty bands */}
            {uncertaintyBands && (
              <>
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  fill="var(--color-primary)"
                  fillOpacity={0.1}
                  stroke="none"
                  name="Upper Bound"
                />
                <Area
                  type="monotone"
                  dataKey="lowerBound"
                  fill="var(--color-background)"
                  fillOpacity={1}
                  stroke="none"
                  name="Lower Bound"
                />
              </>
            )}
            
            {/* Predicted visitors */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: 'var(--color-primary)', strokeWidth: 2 }}
              name="Predicted Visitors"
            />
            
            {/* Actual visitors (for past hours) */}
            <Line
              type="monotone"
              dataKey="actualVisitors"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', strokeWidth: 2, r: 5 }}
              connectNulls={false}
              name="Actual Visitors"
            />
            
            {/* Capacity reference line */}
            <ReferenceLine 
              y={2000} 
              stroke="var(--color-error)" 
              strokeDasharray="5 5"
              label={{
                value: "Capacity Limit",
                position: "topRight",
                style: { 
                  fontSize: '12px', 
                  fill: 'var(--color-error)',
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
            
            {/* Current time marker */}
            <ReferenceLine 
              x={chartData?.[0]?.time} 
              stroke="var(--color-accent)" 
              strokeDasharray="3 3"
              label={{
                value: "Now",
                position: "top",
                style: { 
                  fontSize: '12px', 
                  fill: 'var(--color-accent)',
                  fontFamily: 'Inter, sans-serif'
                }
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Forecast Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-card-foreground">
            {Math.max(...chartData?.map(item => item?.predicted))?.toLocaleString('en-IN')}
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Peak Prediction
          </div>
          <div className="text-xs font-mono text-primary mt-1">
            {chartData?.find(item => item?.predicted === Math.max(...chartData?.map(i => i?.predicted)))?.time}
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-success">
            {(chartData?.reduce((sum, item) => sum + item?.confidence, 0) / chartData?.length)?.toFixed(1)}%
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Avg Confidence
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-warning">
            {Math.max(...chartData?.map(item => item?.utilization))?.toFixed(1)}%
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Peak Utilization
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-heading font-bold text-accent">
            {getCurrentScenario()?.multiplier}x
          </div>
          <div className="text-sm font-caption text-muted-foreground">
            Scenario Impact
          </div>
        </div>
      </div>
      {/* Alerts */}
      {Math.max(...chartData?.map(item => item?.utilization)) > 90 && (
        <div className="mt-4 p-4 bg-error/10 border border-error/20 rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="font-heading font-medium text-error">
              High Capacity Alert
            </span>
          </div>
          <p className="text-sm font-body text-error mt-1">
            Predicted utilization exceeds 90% during peak hours. Consider crowd management measures.
          </p>
        </div>
      )}
    </div>
  );
};

export default PredictiveForecast;