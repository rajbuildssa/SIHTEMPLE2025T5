import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import MetricsStrip from './components/MetricsStrip';
import FilterControls from './components/FilterControls';
import HeatMapVisualization from './components/HeatMapVisualization';
import MLPredictionPanel from './components/MLPredictionPanel';
import SeasonalTrendsChart from './components/SeasonalTrendsChart';
import PredictiveForecast from './components/PredictiveForecast';

const CrowdAnalyticsDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    dateRange: 'last7days',
    seasonal: 'all',
    festivalImpact: true,
    weatherCorrelation: 'all',
    comparisonMode: 'previousPeriod',
    realTimeUpdates: true,
    confidenceThreshold: 85,
    predictionHorizon: 24,
    granularity: 'hourly'
  });

  // Mock metrics data
  const metricsData = [
    {
      id: 'daily_visitors',
      type: 'visitors',
      title: 'Daily Average',
      subtitle: 'Visitors per day',
      value: 1247,
      unit: 'visitors',
      trend: 12.5,
      comparison: 'vs last week',
      status: 'Normal',
      threshold: 2000
    },
    {
      id: 'peak_hour',
      type: 'peak',
      title: 'Peak Hour',
      subtitle: 'Highest traffic time',
      value: 18,
      unit: ':00 hrs',
      trend: -2.1,
      comparison: '1 hour earlier',
      status: 'Evening',
      threshold: null
    },
    {
      id: 'crowd_density',
      type: 'density',
      title: 'Crowd Density',
      subtitle: 'Current utilization',
      value: 73.2,
      unit: '%',
      trend: 8.7,
      comparison: 'of capacity',
      status: 'Moderate',
      threshold: 90
    },
    {
      id: 'bottlenecks',
      type: 'bottleneck',
      title: 'Bottlenecks',
      subtitle: 'Active congestion points',
      value: 2,
      unit: 'locations',
      trend: -25.0,
      comparison: 'vs yesterday',
      status: 'Improving',
      threshold: 5
    }
  ];

  // Auto-refresh functionality
  useEffect(() => {
    if (filters?.realTimeUpdates) {
      const interval = setInterval(() => {
        setLastUpdate(new Date());
        // Simulate data refresh
        console.log('Refreshing analytics data...');
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [filters?.realTimeUpdates, refreshInterval]);

  const handleTimeSelection = (timeData) => {
    setSelectedTimeRange(timeData);
    console.log('Selected time range:', timeData);
  };

  const handleScenarioChange = (scenario) => {
    console.log('Prediction scenario changed:', scenario);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  const exportDashboard = (format) => {
    console.log(`Exporting dashboard in ${format} format`);
    // Mock export functionality
  };

  const toggleRealTimeUpdates = () => {
    setFilters(prev => ({
      ...prev,
      realTimeUpdates: !prev?.realTimeUpdates
    }));
  };

  return (
    <>
      <Helmet>
        <title>Crowd Analytics Dashboard - Temple Analytics</title>
        <meta name="description" content="Deep visitor pattern analysis and predictive crowd modeling for strategic temple management planning" />
        <meta name="keywords" content="crowd analytics, visitor patterns, temple management, predictive modeling, ML forecasting" />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />
        <Sidebar 
          isCollapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        
        <main className={`transition-sacred ${sidebarCollapsed ? 'ml-16' : 'ml-64'} pt-6`}>
          <div className="px-6 pb-6">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center sacred-shadow-sm">
                  <Icon name="Users" size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-heading font-bold text-foreground">
                    Crowd Analytics Dashboard
                  </h1>
                  <p className="text-lg font-body text-muted-foreground">
                    Deep visitor pattern analysis and predictive crowd modeling
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-2 bg-card rounded-lg sacred-shadow-sm border border-border">
                  <div className={`w-2 h-2 rounded-full ${
                    filters?.realTimeUpdates ? 'bg-success breathing-animation' : 'bg-muted-foreground'
                  }`} />
                  <span className="text-sm font-mono text-card-foreground">
                    {lastUpdate?.toLocaleTimeString('en-IN', { hour12: false })}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={filters?.realTimeUpdates ? "Pause" : "Play"}
                    onClick={toggleRealTimeUpdates}
                    title={filters?.realTimeUpdates ? "Pause updates" : "Resume updates"}
                  />
                </div>
                
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  onClick={() => exportDashboard('pdf')}
                >
                  Export Report
                </Button>
              </div>
            </div>

            {/* Loading Overlay */}
            {isLoading && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-card rounded-lg p-6 sacred-shadow-lg border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="font-body text-card-foreground">
                      Updating analytics data...
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Filter Controls */}
            <FilterControls 
              filters={filters} 
              onFiltersChange={handleFiltersChange}
            />

            {/* Metrics Strip */}
            <MetricsStrip metrics={metricsData} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 mb-8">
              {/* Heat Map Visualization - 8 columns */}
              <div className="xl:col-span-8">
                <HeatMapVisualization 
                  data={metricsData}
                  onTimeSelect={handleTimeSelection}
                />
              </div>

              {/* ML Prediction Panel - 4 columns */}
              <div className="xl:col-span-4">
                <MLPredictionPanel 
                  predictionData={metricsData}
                />
              </div>
            </div>

            {/* Full-width Charts */}
            <div className="space-y-6">
              {/* Seasonal Trends Chart */}
              <SeasonalTrendsChart 
                data={metricsData}
                filters={filters}
              />

              {/* Predictive Forecast */}
              <PredictiveForecast 
                forecastData={metricsData}
                onScenarioChange={handleScenarioChange}
              />
            </div>

            {/* Selected Time Range Details */}
            {selectedTimeRange && (
              <div className="mt-6 bg-card rounded-lg p-6 sacred-shadow-sm border border-border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={20} className="text-primary" />
                    <h3 className="font-heading font-semibold text-lg text-card-foreground">
                      Selected Time Period Analysis
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="X"
                    onClick={() => setSelectedTimeRange(null)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="text-sm font-body text-muted-foreground">Time Range</div>
                    <div className="font-mono text-lg text-card-foreground">
                      {selectedTimeRange?.timeRange || 'Selected Period'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-body text-muted-foreground">Visitor Count</div>
                    <div className="font-mono text-lg text-card-foreground">
                      {selectedTimeRange?.visitors?.toLocaleString('en-IN') || 'N/A'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-body text-muted-foreground">Utilization</div>
                    <div className="font-mono text-lg text-card-foreground">
                      {selectedTimeRange?.utilization?.toFixed(1) || 'N/A'}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center justify-between text-sm font-caption text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span>Data refreshes every {refreshInterval / 60000} minutes</span>
                  <span>•</span>
                  <span>ML model accuracy: 92.5%</span>
                  <span>•</span>
                  <span>Confidence threshold: {filters?.confidenceThreshold}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} className="text-success" />
                  <span>Real-time monitoring active</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CrowdAnalyticsDashboard;