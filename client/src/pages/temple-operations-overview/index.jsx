import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import KPIMetricCard from './components/KPIMetricCard';
import PredictionChart from './components/PredictionChart';
import LiveAlertFeed from './components/LiveAlertFeed';
import TempleStatusGrid from './components/TempleStatusGrid';
import GlobalControlPanel from './components/GlobalControlPanel';

const TempleOperationsOverview = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState('dwarka-main');
  const [selectedDateRange, setSelectedDateRange] = useState('today');
  const [isLoading, setIsLoading] = useState(false);

  // Mock real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      // Simulate occasional connection issues
      if (Math.random() < 0.05) {
        setConnectionStatus('connecting');
        setTimeout(() => setConnectionStatus('connected'), 2000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Mock KPI data with live updates
  const [kpiData, setKpiData] = useState([
    {
      title: 'Current Visitors',
      value: '1,247',
      unit: 'people',
      trend: 'up',
      trendValue: '+12%',
      icon: 'Users',
      color: 'primary',
      isLive: true,
      sparklineData: [1100, 1150, 1200, 1180, 1220, 1247, 1260, 1240, 1247],
      threshold: { current: 1247, max: 2000 }
    },
    {
      title: 'Capacity Utilization',
      value: '62',
      unit: '%',
      trend: 'up',
      trendValue: '+5%',
      icon: 'BarChart3',
      color: 'success',
      isLive: true,
      threshold: { current: 1247, max: 2000 }
    },
    {
      title: 'Predicted Peak Time',
      value: '18:30',
      unit: 'IST',
      trend: 'up',
      trendValue: '95% confidence',
      icon: 'Clock',
      color: 'warning',
      isLive: false
    },
    {
      title: 'Today\'s Donations',
      value: '₹2,45,680',
      unit: '',
      trend: 'up',
      trendValue: '+18%',
      icon: 'DollarSign',
      color: 'accent',
      isLive: true,
      sparklineData: [200000, 210000, 225000, 235000, 245680]
    }
  ]);

  // Mock historical and prediction data
  const historicalData = [
    { timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)?.getTime(), visitors: 800 },
    { timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)?.getTime(), visitors: 950 },
    { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000)?.getTime(), visitors: 1100 },
    { timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000)?.getTime(), visitors: 1200 },
    { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)?.getTime(), visitors: 1180 },
    { timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)?.getTime(), visitors: 1247 },
    { timestamp: Date.now(), visitors: 1247 }
  ];

  const predictionData = [
    { 
      timestamp: new Date(Date.now() + 1 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1350, 
      confidence: 92,
      festivalImpact: 8
    },
    { 
      timestamp: new Date(Date.now() + 2 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1480, 
      confidence: 89,
      festivalImpact: 12
    },
    { 
      timestamp: new Date(Date.now() + 3 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1650, 
      confidence: 85,
      festivalImpact: 15,
      festivalBoost: 1750
    },
    { 
      timestamp: new Date(Date.now() + 4 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1820, 
      confidence: 88,
      festivalImpact: 18,
      festivalBoost: 1920
    },
    { 
      timestamp: new Date(Date.now() + 5 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1750, 
      confidence: 90,
      festivalImpact: 15,
      festivalBoost: 1850
    },
    { 
      timestamp: new Date(Date.now() + 6 * 60 * 60 * 1000)?.getTime(), 
      predicted: 1600, 
      confidence: 93,
      festivalImpact: 10
    }
  ];

  // Mock live alerts
  const liveAlerts = [
    {
      id: 1,
      title: 'High Crowd Density Alert',
      message: 'Main darshan area approaching 85% capacity. Consider crowd control measures.',
      severity: 'high',
      type: 'capacity',
      location: 'Main Darshan Hall',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      metrics: {
        currentCapacity: '85%',
        maxCapacity: '2000 people',
        waitTime: '25 minutes'
      },
      actions: [
        { label: 'Deploy Staff', icon: 'Users', primary: true },
        { label: 'Open Alternate Route', icon: 'ArrowRight', primary: false }
      ]
    },
    {
      id: 2,
      title: 'Medical Staff Required',
      message: 'Elderly visitor needs assistance near the main entrance.',
      severity: 'medium',
      type: 'emergency',
      location: 'Main Entrance',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      metrics: {
        responseTime: '3 minutes',
        staffAvailable: '2 personnel'
      },
      actions: [
        { label: 'Dispatch Medic', icon: 'Heart', primary: true },
        { label: 'Call Ambulance', icon: 'Phone', primary: false }
      ]
    },
    {
      id: 3,
      title: 'Parking Area Full',
      message: 'Main parking lot has reached maximum capacity. Directing to overflow area.',
      severity: 'medium',
      type: 'traffic',
      location: 'Main Parking',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      metrics: {
        occupancy: '100%',
        overflowAvailable: '150 spaces'
      },
      actions: [
        { label: 'Update Signage', icon: 'Navigation', primary: true }
      ]
    },
    {
      id: 4,
      title: 'System Performance Normal',
      message: 'All monitoring systems operating within normal parameters.',
      severity: 'low',
      type: 'system',
      location: 'Control Center',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      metrics: {
        uptime: '99.8%',
        latency: '45ms'
      },
      actions: []
    }
  ];

  // Mock temple status data
  const templeStatusData = [
    {
      id: 1,
      name: 'Queue Management',
      category: 'queue',
      location: 'Main Darshan',
      status: 'normal',
      currentValue: 180,
      unit: 'people',
      threshold: { max: 300 },
      lastUpdated: new Date(Date.now() - 2 * 60 * 1000),
      metrics: {
        avgWaitTime: 25,
        throughput: 12
      }
    },
    {
      id: 2,
      name: 'Parking Utilization',
      category: 'parking',
      location: 'Main Lot',
      status: 'warning',
      currentValue: 95,
      unit: '%',
      threshold: { max: 100 },
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000),
      metrics: {
        totalSpaces: 500,
        overflowSpaces: 150
      }
    },
    {
      id: 3,
      name: 'Prasadam Counter',
      category: 'prasadam',
      location: 'Distribution Hall',
      status: 'normal',
      currentValue: 450,
      unit: 'servings',
      threshold: { max: 800 },
      lastUpdated: new Date(Date.now() - 30 * 1000),
      metrics: {
        prepared: 600,
        distributed: 450
      }
    },
    {
      id: 4,
      name: 'Medical Staff',
      category: 'medical',
      location: 'First Aid Station',
      status: 'normal',
      currentValue: 4,
      unit: 'personnel',
      threshold: { max: 6 },
      lastUpdated: new Date(Date.now() - 5 * 60 * 1000),
      metrics: {
        onDuty: 4,
        incidents: 2
      }
    },
    {
      id: 5,
      name: 'Security Coverage',
      category: 'security',
      location: 'All Areas',
      status: 'normal',
      currentValue: 12,
      unit: 'guards',
      threshold: { max: 15 },
      lastUpdated: new Date(Date.now() - 3 * 60 * 1000),
      metrics: {
        activePatrols: 8,
        fixedPosts: 4
      }
    },
    {
      id: 6,
      name: 'Donation Counters',
      category: 'donation',
      location: 'Multiple Locations',
      status: 'normal',
      currentValue: 8,
      unit: 'active',
      threshold: { max: 10 },
      lastUpdated: new Date(Date.now() - 1 * 60 * 1000),
      metrics: {
        todayTotal: 245680,
        avgPerHour: 15355
      }
    },
    {
      id: 7,
      name: 'Audio System',
      category: 'audio',
      location: 'Main Hall',
      status: 'normal',
      currentValue: 100,
      unit: '%',
      threshold: { max: 100 },
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000),
      metrics: {
        volume: 75,
        clarity: 98
      }
    },
    {
      id: 8,
      name: 'Lighting System',
      category: 'lighting',
      location: 'Temple Complex',
      status: 'normal',
      currentValue: 95,
      unit: '%',
      threshold: { max: 100 },
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
      metrics: {
        powerConsumption: 85,
        brightness: 95
      }
    }
  ];

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleDateRangeChange = (range) => {
    setSelectedDateRange(range);
    setIsLoading(true);
    // Simulate data loading
    setTimeout(() => setIsLoading(false), 800);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setLastUpdate(new Date());
    // Simulate data refresh
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleAlertAction = (alert, action) => {
    console.log('Alert action:', action?.label, 'for alert:', alert?.title);
    // Handle alert actions
  };

  const handleStatusClick = (status) => {
    console.log('Status clicked:', status?.name);
    // Handle status item click
  };

  const handleChartZoom = (dataPoint) => {
    console.log('Chart zoom:', dataPoint);
    // Handle chart zoom/interaction
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Temple Operations Overview - Temple Analytics</title>
        <meta name="description" content="Real-time temple management dashboard with crowd predictions, live monitoring, and operational intelligence for Dwarka Temple." />
      </Helmet>
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      <main className={`transition-sacred ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      } pt-6 pb-8 px-6`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Temple Operations Overview
            </h1>
            <p className="text-lg font-body text-muted-foreground">
              Real-time monitoring and 24-hour crowd predictions for Dwarka Temple complex
            </p>
          </div>

          {/* Global Control Panel */}
          <GlobalControlPanel
            onLocationChange={handleLocationChange}
            onDateRangeChange={handleDateRangeChange}
            onRefresh={handleRefresh}
            connectionStatus={connectionStatus}
            lastUpdate={lastUpdate}
          />

          {/* KPI Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpiData?.map((kpi, index) => (
              <KPIMetricCard
                key={index}
                title={kpi?.title}
                value={kpi?.value}
                unit={kpi?.unit}
                trend={kpi?.trend}
                trendValue={kpi?.trendValue}
                icon={kpi?.icon}
                color={kpi?.color}
                isLive={kpi?.isLive}
                sparklineData={kpi?.sparklineData}
                threshold={kpi?.threshold}
              />
            ))}
          </div>

          {/* Main Visualization Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prediction Chart */}
            <div className="lg:col-span-2">
              <PredictionChart
                historicalData={historicalData}
                predictionData={predictionData}
                isLoading={isLoading}
                onZoom={handleChartZoom}
                selectedTimeRange="24h"
              />
            </div>

            {/* Live Alert Feed */}
            <div className="lg:col-span-1">
              <LiveAlertFeed
                alerts={liveAlerts}
                onAlertAction={handleAlertAction}
                maxVisible={8}
              />
            </div>
          </div>

          {/* Temple Status Grid */}
          <TempleStatusGrid
            statusData={templeStatusData}
            onStatusClick={handleStatusClick}
            gridCols={4}
          />
        </div>
      </main>
    </div>
  );
};

export default TempleOperationsOverview;