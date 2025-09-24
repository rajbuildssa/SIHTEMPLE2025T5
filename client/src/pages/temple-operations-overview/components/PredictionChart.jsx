import React, { useState, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PredictionChart = ({ 
  historicalData = [], 
  predictionData = [], 
  isLoading = false,
  onZoom = null,
  selectedTimeRange = '24h'
}) => {
  const [chartData, setChartData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  useEffect(() => {
    // Combine historical and prediction data
    const combined = [
      ...historicalData?.map(item => ({
        ...item,
        type: 'historical',
        confidence: null
      })),
      ...predictionData?.map(item => ({
        ...item,
        type: 'prediction',
        confidence: item?.confidence || 85
      }))
    ];
    
    setChartData(combined);
  }, [historicalData, predictionData]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatTooltipTime = (timestamp) => {
    const date = new Date(timestamp);
    return date?.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-popover border border-border rounded-lg p-4 sacred-shadow-lg">
          <p className="font-heading font-medium text-sm text-popover-foreground mb-2">
            {formatTooltipTime(label)}
          </p>
          {payload?.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 mb-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry?.color }}
              />
              <span className="text-sm font-body text-popover-foreground">
                {entry?.name}: <span className="font-mono font-medium">{entry?.value?.toLocaleString()}</span>
              </span>
            </div>
          ))}
          {data?.type === 'prediction' && data?.confidence && (
            <div className="mt-2 pt-2 border-t border-border">
              <span className="text-xs font-caption text-muted-foreground">
                Confidence: {data?.confidence}%
              </span>
            </div>
          )}
          {data?.festivalImpact && (
            <div className="mt-2 pt-2 border-t border-border">
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={12} className="text-secondary" />
                <span className="text-xs font-caption text-secondary">
                  Festival Impact: +{data?.festivalImpact}%
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data) => {
    if (data && data?.activePayload) {
      setSelectedDataPoint(data?.activePayload?.[0]?.payload);
      if (onZoom) {
        onZoom(data?.activePayload?.[0]?.payload);
      }
    }
  };

  const getMaxVisitors = () => {
    return Math.max(...chartData?.map(d => Math.max(d?.visitors || 0, d?.predicted || 0)));
  };

  const timeRangeOptions = [
    { value: '6h', label: '6H', icon: 'Clock3' },
    { value: '12h', label: '12H', icon: 'Clock6' },
    { value: '24h', label: '24H', icon: 'Clock' },
    { value: '48h', label: '48H', icon: 'Calendar' }
  ];

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6 sacred-shadow-sm">
        <div className="flex items-center justify-center h-96">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-caption text-muted-foreground">
              Loading prediction data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6 sacred-shadow-sm">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="font-heading font-semibold text-lg text-card-foreground">
            Visitor Flow Prediction
          </h3>
          <p className="text-sm font-caption text-muted-foreground">
            Historical data with 24-hour ML predictions
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Time Range Selector */}
          <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
            {timeRangeOptions?.map((option) => (
              <Button
                key={option?.value}
                variant={selectedTimeRange === option?.value ? 'default' : 'ghost'}
                size="sm"
                iconName={option?.icon}
                iconPosition="left"
                className="text-xs"
                onClick={() => {/* Handle time range change */}}
              >
                {option?.label}
              </Button>
            ))}
          </div>
          
          {/* Chart Controls */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))}
              title="Zoom Out"
            >
              <Icon name="ZoomOut" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))}
              title="Zoom In"
            >
              <Icon name="ZoomIn" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>
        </div>
      </div>
      {/* Chart Container */}
      <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            onClick={handleChartClick}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={formatTime}
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              stroke="var(--color-muted-foreground)"
              fontSize={12}
              fontFamily="JetBrains Mono"
              tickFormatter={(value) => value?.toLocaleString()}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                paddingTop: '20px',
                fontFamily: 'Inter',
                fontSize: '14px'
              }}
            />
            
            {/* Historical Data Area */}
            <Area
              type="monotone"
              dataKey="visitors"
              stroke="var(--color-primary)"
              fill="var(--color-primary)"
              fillOpacity={0.2}
              strokeWidth={2}
              name="Historical Visitors"
              connectNulls={false}
            />
            
            {/* Prediction Line */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="var(--color-secondary)"
              strokeWidth={3}
              strokeDasharray="8 4"
              dot={{ fill: 'var(--color-secondary)', strokeWidth: 2, r: 4 }}
              name="Predicted Visitors"
              connectNulls={false}
            />
            
            {/* Festival Impact Overlay */}
            <Line
              type="monotone"
              dataKey="festivalBoost"
              stroke="var(--color-accent)"
              strokeWidth={2}
              strokeDasharray="4 2"
              dot={false}
              name="Festival Boost"
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {/* Chart Legend and Insights */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-4 h-4 bg-primary rounded" />
          <div>
            <p className="text-sm font-body font-medium text-card-foreground">
              Historical Data
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Actual visitor counts
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-4 h-1 bg-secondary rounded" />
          <div>
            <p className="text-sm font-body font-medium text-card-foreground">
              ML Predictions
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              24-hour forecast
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
          <div className="w-4 h-1 bg-accent rounded" style={{ borderStyle: 'dashed' }} />
          <div>
            <p className="text-sm font-body font-medium text-card-foreground">
              Festival Impact
            </p>
            <p className="text-xs font-caption text-muted-foreground">
              Special event boost
            </p>
          </div>
        </div>
      </div>
      {/* Selected Data Point Details */}
      {selectedDataPoint && (
        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-medium text-sm text-card-foreground">
                Selected Time Point
              </h4>
              <p className="text-xs font-caption text-muted-foreground">
                {formatTooltipTime(selectedDataPoint?.timestamp)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDataPoint(null)}
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs font-caption text-muted-foreground">Visitors</p>
              <p className="font-mono font-medium text-card-foreground">
                {(selectedDataPoint?.visitors || selectedDataPoint?.predicted || 0)?.toLocaleString()}
              </p>
            </div>
            {selectedDataPoint?.confidence && (
              <div>
                <p className="text-xs font-caption text-muted-foreground">Confidence</p>
                <p className="font-mono font-medium text-card-foreground">
                  {selectedDataPoint?.confidence}%
                </p>
              </div>
            )}
            {selectedDataPoint?.festivalImpact && (
              <div>
                <p className="text-xs font-caption text-muted-foreground">Festival Boost</p>
                <p className="font-mono font-medium text-secondary">
                  +{selectedDataPoint?.festivalImpact}%
                </p>
              </div>
            )}
            <div>
              <p className="text-xs font-caption text-muted-foreground">Type</p>
              <p className="font-mono font-medium text-card-foreground capitalize">
                {selectedDataPoint?.type}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionChart;